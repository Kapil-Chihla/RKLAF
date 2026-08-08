const mongoose = require('mongoose');

/**
 * Impact → Press mentions
 * Supports: article clips, external press links, images, quotes,
 * uploaded video, YouTube/Vimeo links, and PDF clippings.
 */
const pressMentionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    /**
     * clip  — outlet + headline + optional press URL + optional image
     * link  — outbound press / article link (URL required)
     * image — photo / clipping scan
     * quote — pull-quote card
     * video — uploaded file and/or YouTube/Vimeo URL
     * pdf   — PDF clipping / report download
     */
    layout: {
      type: String,
      enum: ['clip', 'link', 'image', 'quote', 'video', 'pdf'],
      default: 'clip',
      index: true,
    },
    outlet: { type: String, default: '' },
    title: { type: String, required: true },
    meta: { type: String, default: '' },
    /** External article / press URL */
    url: { type: String, default: '' },
    image: { type: String, default: null },
    imageCaption: { type: String, default: '' },
    quote: { type: String, default: '' },
    quoteAttribution: { type: String, default: '' },
    /** Uploaded video file (Cloudinary) */
    video: { type: String, default: null },
    /** YouTube / Vimeo / external watch URL */
    youtubeUrl: { type: String, default: '' },
    /** Optional video poster / thumbnail */
    thumbnail: { type: String, default: null },
    /** Uploaded PDF */
    pdf: { type: String, default: null },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('PressMention', pressMentionSchema);
