const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventName: { type: String, required: true }, // Which event are they joining?
  attendees: { type: Number, default: 1 },    // How many people are they bringing?
  message: { type: String },
  // Administrative review state; defaults also apply when old records are read through Mongoose.
  status: {
    type: String,
    enum: ["Registered", "Confirmed", "Cancelled"],
    default: "Registered"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);