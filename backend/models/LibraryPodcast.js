const mongoose = require('mongoose');

/** Library page — audio & video podcast episodes (file upload and/or external link) */
const libraryPodcastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    /** audio | video */
    kind: { type: String, required: true, enum: ['audio', 'video'], index: true },
    title: { type: String, required: true },
    /** Short tag / episode line, e.g. "Senior Citizens · Ep. 42" */
    meta: { type: String, default: '' },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: null },
    /** Uploaded audio or video file (Cloudinary) */
    media: { type: String, default: null },
    /** Spotify / YouTube / Vimeo / direct URL when no file is uploaded */
    externalUrl: { type: String, default: null },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0, index: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('LibraryPodcast', libraryPodcastSchema);
