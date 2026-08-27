const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventName: { type: String, required: true }, // Which event are they joining?
  attendees: { type: Number, default: 1 },    // How many people are they bringing?
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);