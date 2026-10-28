const Announcement = require('../models/Announcement');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const CATEGORIES = ['Winner Announcement', 'Event Recap', 'Impact Story', 'Collaboration', 'General Update'];
const STATUSES = ['Draft', 'Published', 'Scheduled'];
const slugify = (text) => String(text || '').toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
const escapeRegex = (text) => String(text || '').replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
const publicQuery = () => ({ $or: [
  { status: 'Published', $or: [{ publishAt: { $lte: new Date() } }, { publishAt: null }, { publishAt: { $exists: false } }] },
  { status: 'Scheduled', publishAt: { $lte: new Date() } },
  { status: { $exists: false } }
] });
const sendError = (res, err) => res.status(err.code === 11000 ? 409 : 400).json({ error: err.code === 11000 ? 'Announcement slug already exists' : err.message });

async function uniqueSlug(title, exceptId) {
  const base = slugify(title) || 'announcement';
  let slug = base, i = 2;
  while (await Announcement.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) })) slug = `${base}-${i++}`;
  return slug;
}
function validate(payload, existing) {
  const next = { ...payload };
  if (next.category !== undefined && !CATEGORIES.includes(next.category)) throw new Error('Invalid category');
  if (next.status !== undefined && !STATUSES.includes(next.status)) throw new Error('Invalid status');
  if (next.publishAt !== undefined && next.publishAt !== '' && next.publishAt !== null) {
    const date = new Date(next.publishAt);
    if (Number.isNaN(date.getTime())) throw new Error('Invalid publication date');
    next.publishAt = date;
  } else if (next.publishAt === '') next.publishAt = null;
  const status = next.status || existing?.status || 'Published';
  const publishAt = next.publishAt !== undefined ? next.publishAt : existing?.publishAt;
  if (status === 'Scheduled' && (!publishAt || new Date(publishAt) <= new Date())) throw new Error('Scheduled posts need a future publishAt date');
  return next;
}
function pagination(query) {
  return { page: Math.max(1, parseInt(query.page, 10) || 1), limit: Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12)) };
}
exports.getAnnouncements = async (req, res) => {
  try {
    const filter = publicQuery();
    if (req.query.category && CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    if (req.query.search) {
      const q = escapeRegex(String(req.query.search).slice(0, 100));
      filter.$and = [{ $or: [{ title: new RegExp(q, 'i') }, { excerpt: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }] }];
    }
    const { page, limit } = pagination(req.query);
    const items = await Announcement.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    if (!req.query.page && !req.query.limit && !req.query.search) {
      // Preserve original response shape for existing homepage and public page.
      const all = await Announcement.find(filter).sort({ date: -1, createdAt: -1 }).lean();
      return res.json(all);
    }
    const total = await Announcement.countDocuments(filter);
    return res.json({ announcements: items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { return res.status(500).json({ error: err.message }); }
};
exports.getAnnouncement = async (req, res) => {
  try {
    const key = req.params.slug;
    const match = mongoose.isValidObjectId(key) ? { $or: [{ slug: key }, { _id: key }] } : { slug: key };
    const item = await Announcement.findOne({ $and: [publicQuery(), match] });
    if (!item) return res.status(404).json({ error: 'Announcement not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getAdminAnnouncements = async (req, res) => {
  try {
    const { page, limit } = pagination(req.query);
    const filter = {};
    if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    if (req.query.search) filter.title = new RegExp(escapeRegex(String(req.query.search).slice(0, 100)), 'i');
    const [announcements, total] = await Promise.all([
      Announcement.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Announcement.countDocuments(filter)
    ]);
    res.json({ announcements, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.createAnnouncement = async (req, res) => {
  try {
    const input = validate(req.body);
    if (!input.title || !input.content) return res.status(400).json({ error: 'Title and content are required' });
    const slug = await uniqueSlug(input.title);
    const announcement = await Announcement.create({
      title: input.title, content: input.content, excerpt: input.excerpt || '',
      category: input.category || 'General Update', author: input.author || 'Aamna Saleem Khan',
      status: input.status || 'Published', publishAt: input.publishAt || null,
      featuredImage: req.file?.path || input.featuredImage || '', slug,
      date: input.date || new Date()
    });
    res.status(201).json(announcement);
  } catch (err) { sendError(res, err); }
};
exports.updateAnnouncement = async (req, res) => {
  try {
    const item = await Announcement.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Announcement not found' });
    const input = validate(req.body, item);
    const titleChanged = input.title && input.title !== item.title;
    const allowed = ['title', 'content', 'excerpt', 'category', 'status', 'publishAt', 'author', 'date'];
    for (const key of allowed) if (input[key] !== undefined) item[key] = input[key];
    if (req.file?.path) item.featuredImage = req.file.path;
    if (input.featuredImage !== undefined && !req.file) item.featuredImage = input.featuredImage;
    if (titleChanged) item.slug = await uniqueSlug(input.title, item._id);
    if (!item.slug) item.slug = await uniqueSlug(item.title, item._id);
    await item.save();
    res.json(item);
  } catch (err) { sendError(res, err); }
};
exports.deleteAnnouncement = async (req, res) => {
  try {
    const item = await Announcement.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Announcement not found' });
    await item.deleteOne();
    // Do not guess a Cloudinary public ID or delete possibly shared media.
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
