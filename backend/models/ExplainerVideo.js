const mongoose = require('mongoose');

/** Know Your Rights → Explainer videos carousel */
const explainerVideoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    meta: { type: String, default: '' },
    thumbnail: { type: String, default: null },
    /** Cloudinary (or CDN) video file URL */
    video: { type: String, default: null },
    /** Optional YouTube / Vimeo / external watch URL when no file is uploaded */
    externalUrl: { type: String, default: null },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0, index: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('ExplainerVideo', explainerVideoSchema);
