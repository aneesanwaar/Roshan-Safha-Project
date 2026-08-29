const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true
    },
    author: {
      type: String,
      default: "Standard Board / General"
    },
    gradeLevel: {
      type: String,
      required: [true, "Academic level is required"],
      enum: [
        "Primary / Early Years",
        "Middle School",
        "Matric / Class 9-10",
        "Intermediate / FSc",
        "General / Reference"
      ]
    },
    subject: {
      type: String,
      trim: true
    },
    copiesAvailable: {
      type: Number,
      default: 1,
      min: 0
    },
    condition: {
      type: String,
      enum: ["Like New", "Good Condition", "Restored - Excellent"],
      default: "Good Condition"
    },
    location: {
      type: String,
      default: "Muzaffarabad Hub"
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Out of Stock"],
      default: "Available"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);