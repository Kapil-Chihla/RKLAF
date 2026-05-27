const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
