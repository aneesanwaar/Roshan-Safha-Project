const mongoose = require("mongoose");

const collaborationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  collabType: { 
    type: String, 
    required: true
  },
  message: { type: String, required: true },
  // Administrative review state; defaults also apply when old records are read through Mongoose.
  status: {
    type: String,
    enum: ["Pending", "Contacted", "Approved", "Declined"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Collaboration", collaborationSchema);