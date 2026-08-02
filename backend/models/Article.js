const mongoose = require('mongoose');

/** Know Your Rights — practical guide PDFs */
const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    summary: { type: String, default: '' },
    body: { type: String, default: '' },
    category: { type: String, default: 'General' },
    /** Cover / thumbnail for the PDF card grid */
    coverImage: { type: String, default: null },
    file: { type: String, default: null },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Article', articleSchema);
