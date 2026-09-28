const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      index: true
    },
    author: {
      type: String,
      default: "Unknown",
      trim: true
    },
    subject: {
      type: String,
      required: [true, "Subject is required (e.g. Physics, Mathematics, Urdu)"],
      trim: true,
      index: true
    },
    educationLevel: {
      type: String,
      required: [true, "Education level is required"],
      enum: ["Primary", "Middle", "Matric (9th-10th)", "Intermediate (FSc/ICS)", "General Reading", "Other"],
      index: true
    },
    board: {
      type: String,
      default: "AJK / FBISE",
      trim: true
    },
    language: {
      type: String,
      enum: ["English", "Urdu", "Bilingual"],
      default: "English"
    },
    condition: {
      type: String,
      enum: ["Restored", "Good", "Fair"],
      default: "Restored"
    },
    availableQuantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1
    },
    locationShelf: {
      type: String,
      default: "Muzaffarabad Main Hub"
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Auto-sync availability status based on inventory count
bookSchema.pre("save", function () {
  this.isAvailable = this.availableQuantity > 0;
});

module.exports = mongoose.model("Book", bookSchema);