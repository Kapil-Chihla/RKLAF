const mongoose = require('mongoose');

/** Our Work → Annual reports (PDF) */
const reportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    /** Display year e.g. 2025–26 */
    year: { type: String, required: true, index: true },
    /** Short line under the title on Our Work */
    summary: { type: String, default: 'Impact, audited financials & ledger' },
    file: { type: String, required: true },
    createdBy: { type: String, default: '' },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Report', reportSchema);
