const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const Book = require('../models/Book');
const DonationInventoryEntry = require('../models/DonationInventoryEntry');

class OperationError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new OperationError(code, message); };
const integer = (value, minimum = 0) => Number.isSafeInteger(value) && value >= minimum;
const sendError = (res, error) => {
  if (error instanceof OperationError) return res.status(error.code).json({ success: false, error: error.message });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ success: false, error: error.message });
  if (error.code === 11000) return res.status(409).json({ success: false, error: 'This operation has already been recorded.' });
  if (error.code === 112 || error.hasErrorLabel?.('TransientTransactionError')) return res.status(409).json({ success: false, error: 'Another update is in progress. Please refresh and retry.' });
  console.error('Donation inventory error:', error);
  return res.status(500).json({ success: false, error: 'Donation inventory operation failed; changes were rolled back.' });
};
const validId = id => mongoose.isValidObjectId(id);
const progress = donation => ({
  verifiedQuantity: donation.verifiedQuantity ?? 0,
  processedQuantity: donation.processedQuantity ?? 0,
  remainingQuantity: Math.max(0, (donation.verifiedQuantity ?? 0) - (donation.processedQuantity ?? 0)),
  inventoryStatus: donation.inventoryStatus ?? 'Not Processed',
});

// PATCH /api/admin/donations/:id/collect
// Requires JWT middleware. Verified quantity is the actual received amount.
exports.collectDonation = async (req, res) => {
  try {
    if (!validId(req.params.id)) fail(400, 'Invalid donation ID.');
    const verifiedQuantity = req.body?.verifiedQuantity;
    if (!integer(verifiedQuantity, 1)) fail(400, 'Verified quantity must be a positive whole number.');
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['Pledged', 'Collected'] }, $or: [{ processedQuantity: 0 }, { processedQuantity: { $exists: false } }] },
      { $set: { status: 'Collected', verifiedQuantity, collectedAt: new Date(), processedQuantity: 0, inventoryStatus: 'Not Processed' } },
      { new: true, runValidators: true }
    );
    if (!donation) fail(409, 'Donation not found, cancelled, or already partially processed.');
    return res.json({ success: true, message: 'Donation marked collected.', data: donation, progress: progress(donation) });
  } catch (error) { return sendError(res, error); }
};

// POST /api/admin/donations/:id/inventory
// Body: { operationKey, quantity, bookId } OR { operationKey, quantity, newBook: {title, subject, educationLevel, ...} }
exports.addDonationToInventory = async (req, res) => {
  const { operationKey, quantity, bookId, newBook } = req.body || {};
  if (!validId(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid donation ID.' });
  if (typeof operationKey !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(operationKey)) return res.status(400).json({ success: false, error: 'operationKey must contain 8–100 letters, digits, hyphens or underscores.' });
  if (!integer(quantity, 1)) return res.status(400).json({ success: false, error: 'Quantity must be a positive whole number.' });
  if (Boolean(bookId) === Boolean(newBook)) return res.status(400).json({ success: false, error: 'Supply either bookId or newBook, not both.' });
  if (bookId && !validId(bookId)) return res.status(400).json({ success: false, error: 'Invalid book ID.' });
  if (newBook && (typeof newBook !== 'object' || Array.isArray(newBook))) return res.status(400).json({ success: false, error: 'Invalid newBook details.' });
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const duplicate = await DonationInventoryEntry.findOne({ donation: req.params.id, operationKey }).session(session);
      if (duplicate) fail(409, 'This operation was already completed. Do not submit it again.');
      const donation = await Donation.findById(req.params.id).session(session);
      if (!donation) fail(404, 'Donation not found.');
      if (donation.status !== 'Collected') fail(409, 'Mark this donation as Collected before cataloging books.');
      if (!integer(donation.verifiedQuantity, 1)) fail(409, 'Donation has no valid verified quantity.');
      const processed = donation.processedQuantity ?? 0;
      if (!integer(processed) || processed + quantity > donation.verifiedQuantity) fail(409, `Only ${Math.max(0, donation.verifiedQuantity - processed)} books remain to be cataloged.`);
      let book;
      if (bookId) {
        // Use document save to execute Book's availability synchronization hook.
        book = await Book.findById(bookId).session(session);
        if (!book) fail(404, 'Selected book not found.');
        book.availableQuantity += quantity;
        await book.save({ session });
      } else {
        const fields = ['title', 'author', 'subject', 'educationLevel', 'board', 'language', 'condition', 'locationShelf'];
        const data = {};
        for (const field of fields) if (Object.prototype.hasOwnProperty.call(newBook, field)) data[field] = newBook[field];
        const created = await Book.create([{ ...data, availableQuantity: quantity }], { session });
        book = created[0];
      }
      const nextProcessed = processed + quantity;
      // Conditional update protects against two administrators processing the same remaining books.
      const updated = await Donation.findOneAndUpdate(
        { _id: donation._id, status: 'Collected', $or: [{ processedQuantity: processed }, ...(processed === 0 ? [{ processedQuantity: { $exists: false } }] : [])] },
        { $set: { processedQuantity: nextProcessed, inventoryStatus: nextProcessed === donation.verifiedQuantity ? 'Fully Added' : 'Partially Added' } },
        { new: true, runValidators: true, session }
      );
      if (!updated) fail(409, 'Donation progress changed. Refresh and try again.');
      const [entry] = await DonationInventoryEntry.create([{ donation: donation._id, book: book._id, quantity, operationKey, processedBy: req.user._id }], { session });
      result = { donation: updated, book, entry, progress: progress(updated) };
    });
    return res.status(201).json({ success: true, message: 'Donated books added to inventory.', ...result });
  } catch (error) { return sendError(res, error); }
  finally { await session.endSession(); }
};

// GET /api/admin/donations/:id/inventory
exports.getDonationInventoryHistory = async (req, res) => {
  try {
    if (!validId(req.params.id)) fail(400, 'Invalid donation ID.');
    const donation = await Donation.findById(req.params.id).lean();
    if (!donation) fail(404, 'Donation not found.');
    const entries = await DonationInventoryEntry.find({ donation: donation._id }).populate('book', 'title author availableQuantity').populate('processedBy', 'name email').sort({ createdAt: -1 }).lean();
    return res.json({ success: true, donation, progress: progress(donation), entries });
  } catch (error) { return sendError(res, error); }
};
