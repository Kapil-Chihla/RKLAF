const mongoose = require('mongoose');

/** Impact → Told in full (prison programme stories — text + PDFs, no photos) */
const toldDocumentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    name: { type: String, default: 'document.pdf' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    coverImage: { type: String, default: null },
    createdAt: { type: String, default: '' },
  },
  { _id: false }
);

const toldInFullSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    tag: { type: String, default: '' },
    title: { type: String, required: true },
    caption: { type: String, default: '' },
    problem: { type: String, default: '' },
    action: { type: String, default: '' },
    result: { type: String, default: '' },
    documents: { type: [toldDocumentSchema], default: [] },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('ToldInFull', toldInFullSchema);
