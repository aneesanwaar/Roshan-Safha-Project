const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ['home', 'about', 'programs', 'getInvolved', 'contact']
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);