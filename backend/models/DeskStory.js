const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
    /**
     * 1-based paragraph index: show this image immediately after that paragraph.
     * null / 0 = show after the full body (end of story).
     */
    afterParagraph: { type: Number, default: null },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    /** Original filename (download disposition) */
    name: { type: String, default: '' },
    /** Public card title (falls back to name) */
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    coverImage: { type: String, default: null },
    createdAt: { type: String, default: '' },
  },
  { _id: false }
);

const bodyBlockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['paragraph', 'image'], required: true },
    text: { type: String, default: '' },
    id: { type: String, default: null },
    url: { type: String, default: null },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

/** Programmes & Initiatives — case stories */
const deskStorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    number: { type: Number, default: 1 },
    kicker: { type: String, default: 'Senior Citizens' },
    title: { type: String, required: true },
    /** Short copy on the listing */
    listingDescription: { type: String, default: '' },
    /** 1–2 line blurb for home page feature cards */
    featureBlurb: { type: String, default: '' },
    heroImage: { type: String, default: null },
    /** Full story page */
    fullHeader: { type: String, default: '' },
    fullBody: { type: String, default: '' },
    /** Ordered story content: paragraph + image blocks (preferred) */
    bodyBlocks: { type: [bodyBlockSchema], default: [] },
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
