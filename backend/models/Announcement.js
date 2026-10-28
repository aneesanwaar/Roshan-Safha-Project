const mongoose = require('mongoose');

const CATEGORIES = ['Winner Announcement', 'Event Recap', 'Impact Story', 'Collaboration', 'General Update'];
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '', maxlength: 500 },
  category: { type: String, enum: CATEGORIES, default: 'General Update' },
  featuredImage: { type: String, default: '' },
  date: { type: Date, default: Date.now }, // legacy public sort field
  publishAt: { type: Date, default: null },
  status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Published' },
  author: { type: String, default: 'Aamna Saleem Khan' },
}, { timestamps: true });

schema.index({ status: 1, publishAt: -1, date: -1 });
module.exports = mongoose.model('Announcement', schema);
