const mongoose = require("mongoose");

// A donation pledge is separate from the process of cataloging received books.
const DonationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: String,
  numberOfBooks: Number,
  bookTypes: String,
  dropoffMethod: String,
  message: String,

  // Workflow fields. Existing records without these fields are treated as
  // Pledged / Not Processed by the future controller until migrated.
  status: {
    type: String,
    enum: ["Pledged", "Collected", "Cancelled"],
    default: "Pledged",
  },
  verifiedQuantity: {
    type: Number,
    min: 0,
    validate: {
      validator: Number.isSafeInteger,
      message: "Verified quantity must be a whole number.",
    },
  },
  processedQuantity: {
    type: Number,
    min: 0,
    default: 0,
    validate: {
      validator: Number.isSafeInteger,
      message: "Processed quantity must be a whole number.",
    },
  },
  inventoryStatus: {
    type: String,
    enum: ["Not Processed", "Partially Added", "Fully Added"],
    default: "Not Processed",
  },
  collectedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
