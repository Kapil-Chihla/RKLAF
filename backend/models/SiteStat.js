const mongoose = require('mongoose');

const siteStatSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 0 },
  },
  { versionKey: false }
);

module.exports = mongoose.model('SiteStat', siteStatSchema);
