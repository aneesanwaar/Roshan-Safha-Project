const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      trim: true,
      default: "Roshan Safha Moment"
    },
    caption: {
      type: String,
      trim: true,
      default: ""
    },
    album: {
      type: String,
      trim: true,
      default: "Book Restoration Hub"
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    publicId: {
      type: String,
      default: ""
    },
    category: { 
      type: String, 
      enum: ["Event", "Donation", "Workshop", "Other"],
      default: "Event"
    }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);