const mongoose = require('mongoose');

/** Impact → Also on record (PDF ledger: year, header, description) */
const alsoOnRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    year: { type: String, required: true },
    header: { type: String, required: true },
    description: { type: String, default: '' },
    statusChip: { type: String, default: '' },
    file: { type: String, default: null },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('AlsoOnRecord', alsoOnRecordSchema);
