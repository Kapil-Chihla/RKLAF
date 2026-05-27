const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true },
    role: { type: String, required: true },
    token: { type: String, required: true, index: true },
    status: { type: String, default: 'pending' },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    expiresAt: { type: String, required: true },
    usedAt: { type: String },
    usedBy: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Invite', inviteSchema);
