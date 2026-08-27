const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({

  name: {
    type: String,
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

  city: String,

  numberOfBooks: Number,

  bookTypes: String,

  dropoffMethod: String,

  message: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Donation", DonationSchema);