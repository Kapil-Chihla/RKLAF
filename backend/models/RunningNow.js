const mongoose = require('mongoose');

/** Impact → Running now (pending matters) */
const runningNowSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    status: { type: String, default: 'In trial' },
    title: { type: String, required: true },
    allegation: { type: String, default: '' },
    reliefSought: { type: String, default: '' },
    stage: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('RunningNow', runningNowSchema);
