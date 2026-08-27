const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Only one admin account with this email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin", // Default role for the Founder (Aamna Saleem Khan)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- SECURITY HOOK ---
// --- SECURITY HOOK ---
// In modern Mongoose, async hooks don't need the 'next' parameter
userSchema.pre("save", async function () {
  // 1. Only encrypt if the password is new or being changed
  if (!this.isModified("password")) {
    return; // Just return, don't call next()
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() call here! The 'async' handles it.
  } catch (error) {
    throw error; // Throw the error so Mongoose catches it
  }
});

// --- HELPER METHOD ---
// This is used in the AuthController to check login credentials
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);