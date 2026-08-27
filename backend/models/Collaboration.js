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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Collaboration", collaborationSchema);