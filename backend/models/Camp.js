const mongoose = require('mongoose');

const campSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    location: { type: String, default: '' },
    date: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Camp', campSchema);
