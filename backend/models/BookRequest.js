const mongoose = require("mongoose");

const bookRequestSchema = new mongoose.Schema(
  {
    // Reference to an existing book in the inventory
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "A book must be selected"],
      index: true,
    },

    // Requester information
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: 120,
    },

    phone: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      maxlength: 30,
    },

    institution: {
      type: String,
      required: [true, "School or college name is required"],
      trim: true,
      maxlength: 200,
    },

    // Number of copies requested
    quantity: {
      type: Number,
      required: [true, "Requested quantity is required"],
      min: [1, "You must request at least one copy"],
      validate: {
        validator: Number.isInteger,
        message: "Requested quantity must be a whole number",
      },
    },

    // Why the student needs the book
    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Preferred method of receiving the book
    collectionPreference: {
      type: String,
      enum: ["Collection", "Delivery"],
      default: "Collection",
    },

    // Admin-managed request status
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Fulfilled"],
      default: "Pending",
      index: true,
    },

    // Optional notes added by the administrator
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // When the books were actually handed over
    fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helps the dashboard retrieve the newest requests efficiently
bookRequestSchema.index({ createdAt: -1 });

// Helps filter requests by book and status
bookRequestSchema.index({ book: 1, status: 1 });

module.exports = mongoose.model("BookRequest", bookRequestSchema);