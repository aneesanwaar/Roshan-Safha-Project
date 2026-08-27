const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Winner Announcement",
      "Event Recap",
      "Impact Story",
      "Collaboration",
      "General Update",
    ],
    default: "General Update",
  },
  featuredImage: {
    type: String, // URL to the image (Cloudinary or local path)
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    default: "Aamna Saleem Khan", // Founder by default
  },
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);