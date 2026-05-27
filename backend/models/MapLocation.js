const mongoose = require('mongoose');

const workItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, default: '' },
  },
  { _id: false }
);

const mapLocationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    country: { type: String, default: '' },
    region: { type: String, default: '' },
    workType: { type: String, default: '' },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    mapX: { type: Number, required: true },
    mapY: { type: Number, required: true },
    summary: { type: String, default: '' },
    workItems: { type: [workItemSchema], default: [] },
    overviewUrl: { type: String, default: '/our-work/impact' },
    active: { type: Boolean, default: true },
    createdBy: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model('MapLocation', mapLocationSchema);
