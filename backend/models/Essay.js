const mongoose = require("mongoose");

const essaySchema = new mongoose.Schema({
  studentName: { 
    type: String, 
    required: [true, "Participant name is required"],
    trim: true 
  },
  age: { 
    type: Number, 
    required: [true, "Age is required"],
    min: [5, "Age must be at least 5"],
    max: [100, "Age must be realistic"]
  },
  institutionName: { 
    type: String, 
    required: [true, "Institution/School name is required"],
    trim: true
  },
  category: { 
    type: String, 
    required: true, 
    enum: ["Junior", "Senior"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"] 
  },
  essayTitle: { 
    type: String, 
    required: [true, "Essay title is required"],
    trim: true
  },
  fileUrl: { 
    type: String, 
    required: [true, "Please upload your essay file (PDF/Word)"] 
  },
  hasAgreed: { 
    type: Boolean, 
    required: [true, "You must agree to the terms and conditions"],
    enum: [true] 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Reviewed", "Winner"], 
    default: "Pending" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Essay", essaySchema);