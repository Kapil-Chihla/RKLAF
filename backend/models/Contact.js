const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    message: { type: String, required: true },
    /** contact | know-your-rights | donate | general */
    source: { type: String, default: 'contact', index: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Contact', contactSchema);
