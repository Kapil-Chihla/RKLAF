const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    /** Optional italic line under the name (e.g. courts / title detail) */
    subtitle: { type: String, default: '' },
    bio: { type: String, default: '' },
    image: { type: String, default: null },
    /** Lower numbers appear first on About → Our Team */
    sortOrder: { type: Number, default: 0 },
  },
  { versionKey: false }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
