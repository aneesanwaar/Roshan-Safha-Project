const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema(
  {
    editionYear: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Junior', 'Senior'],
      required: true
    },
    placement: {
      type: String,
      required: true,
      trim: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    essayTitle: {
      type: String,
      required: true,
      trim: true
    },
    awardPrizes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Winner', winnerSchema);