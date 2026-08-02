const mongoose = require('mongoose');

/** Academics → Research & White Papers (PDF cards) */
const paperSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    kind: {
      type: String,
      enum: ['research', 'white-paper'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    meta: { type: String, default: '' },
    file: { type: String, default: null },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Paper', paperSchema);
