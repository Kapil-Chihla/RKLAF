const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, default: '' },
    body: { type: String, default: '' },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    /** Point-wise sections for the full article page */
    sections: { type: [sectionSchema], default: [] },
    /** Academics shelf: blog | experience */
    kind: {
      type: String,
      enum: ['blog', 'experience'],
      default: 'blog',
      index: true,
    },
    author: { type: String, default: '' },
    image: { type: String, default: null },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Blog', blogSchema);
