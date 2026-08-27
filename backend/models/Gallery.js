const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Please provide a title for the photo"],
    trim: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ["Event", "Donation", "Workshop", "Other"],
    default: "Event"
  }
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);