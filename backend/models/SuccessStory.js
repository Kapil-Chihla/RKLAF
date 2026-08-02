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

/** Impact → Success stories */
const successStorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    tag: { type: String, default: '' },
    title: { type: String, required: true },
    caption: { type: String, default: '' },
    heroImage: { type: String, default: null },
    problem: { type: String, default: '' },
    action: { type: String, default: '' },
    result: { type: String, default: '' },
    fullBody: { type: String, default: '' },
    gallery: { type: [galleryImageSchema], default: [] },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
