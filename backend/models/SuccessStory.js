const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    name: { type: String, default: '' },
    /** Public label — preferred over original filename on the website */
    title: { type: String, default: '' },
    createdAt: { type: String, default: '' },
  },
  { _id: false }
);

/** Impact → Success stories */
const successStorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    tag: { type: String, default: '' },
    title: { type: String, required: true },
    caption: { type: String, default: '' },
    /** Forum / file line under the title, e.g. "Maintenance Tribunal · File RK/2024/0187" */
    caseLine: { type: String, default: '' },
    heroImage: { type: String, default: null },
    problem: { type: String, default: '' },
    action: { type: String, default: '' },
    result: { type: String, default: '' },
    fullBody: { type: String, default: '' },
    gallery: { type: [galleryImageSchema], default: [] },
    documents: { type: [documentSchema], default: [] },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
