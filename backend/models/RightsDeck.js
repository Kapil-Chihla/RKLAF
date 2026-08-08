const mongoose = require('mongoose');

/** Know Your Rights → Guides-as-decks carousel */
const rightsDeckSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, index: true },
    /** Card top label, e.g. "SENIOR CITIZENS" */
    category: { type: String, default: '' },
    /** Detail eyebrow / small title, e.g. "GUIDE 02 · REPORTING A CRIME" */
    smallTitle: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    banner: { type: String, default: null },
    pdf: { type: String, default: null },
    /** Optional meta under the card, e.g. 5 → "5 SLIDES" */
    slideCount: { type: Number, default: null },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('RightsDeck', rightsDeckSchema);
