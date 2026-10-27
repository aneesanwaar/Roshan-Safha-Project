const mongoose = require("mongoose");

// Immutable audit record for a single successful donation-to-stock operation.
// The controller in Step 9E.6C.2B will create this inside the same MongoDB
// transaction as the Book stock increase and Donation progress update.
const DonationInventoryEntrySchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: "Quantity must be a positive whole number.",
      },
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // One unique key per requested operation; repeated requests must not
    // add stock again. The future controller will require this key.
    operationKey: {
      type: String,
      required: true,
      immutable: true,
    },
  },
  { timestamps: true }
);

DonationInventoryEntrySchema.index({ donation: 1, operationKey: 1 }, { unique: true });

module.exports = mongoose.model(
  "DonationInventoryEntry",
  DonationInventoryEntrySchema
);
