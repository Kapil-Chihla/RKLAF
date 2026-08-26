const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateId = require('../lib/generateId');
const { ROLES } = require('../auth');

/** Primary super admin — kept in sync on backend start */
const SUPER_ADMIN = {
  name: 'RKLAF Super Admin',
  email: 'admin@rklaf.org',
  password: 'Rklaf@Admin2026',
};

async function seedTestSuperAdmin() {
  const email = SUPER_ADMIN.email.toLowerCase();
  const hashed = await bcrypt.hash(SUPER_ADMIN.password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashed;
    existing.role = ROLES.SUPER_ADMIN;
    existing.status = 'active';
    existing.name = SUPER_ADMIN.name;
    await existing.save();
  } else {
    await User.create({
      id: generateId('u'),
      name: SUPER_ADMIN.name,
      email,
      password: hashed,
      role: ROLES.SUPER_ADMIN,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'seed',
    });
  }

  // Keep a single super admin: demote any other super_admin accounts
  await User.updateMany(
    { role: ROLES.SUPER_ADMIN, email: { $ne: email } },
    { $set: { role: ROLES.ADMIN, status: 'disabled' } }
  );

  console.log(`Super admin ready: ${email}`);
}

module.exports = seedTestSuperAdmin;
module.exports.SUPER_ADMIN = SUPER_ADMIN;
module.exports.TEST_SUPER_ADMIN = SUPER_ADMIN;
