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
    createdAt: { type: String, default: '' },
  },
  { _id: false }
);

/** The Desk — standalone case stories page */
const deskStorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    number: { type: Number, default: 1 },
    kicker: { type: String, default: 'Senior Citizens' },
    title: { type: String, required: true },
    /** Short copy on the Desk listing */
    listingDescription: { type: String, default: '' },
    heroImage: { type: String, default: null },
    /** Full story page */
    fullHeader: { type: String, default: '' },
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

module.exports = mongoose.model('DeskStory', deskStorySchema);
