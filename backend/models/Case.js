const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    area: { type: String, default: '' },
    status: { type: String, default: 'active' },
    image: { type: String, default: null },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Case', caseSchema);
