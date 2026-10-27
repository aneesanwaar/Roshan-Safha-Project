const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  // Administrative review state; defaults also apply when old records are read through Mongoose.
  status: {
    type: String,
    enum: ["Unread", "Reviewed", "Resolved"],
    default: "Unread"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", contactSchema);