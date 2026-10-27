const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  message: String,
  // Administrative review state; defaults also apply when old records are read through Mongoose.
  status: {
    type: String,
    enum: ["Pending", "Active", "Declined", "Archived"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);