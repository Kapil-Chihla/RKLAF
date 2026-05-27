const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    summary: { type: String, default: '' },
    body: { type: String, default: '' },
    file: { type: String, default: null },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Article', articleSchema);
