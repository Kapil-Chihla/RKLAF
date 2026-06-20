const mongoose = require('mongoose');

const campImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const campSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    location: { type: String, default: '' },
    date: { type: String, default: '' },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    heroImage: { type: String, default: null },
    coverImage: { type: String, default: null },
    images: { type: [campImageSchema], default: [] },
    tags: { type: [String], default: [] },
    /** @deprecated use coverImage + images */
    image: { type: String, default: null },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Camp', campSchema);
