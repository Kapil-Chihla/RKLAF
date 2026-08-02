const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateId = require('../lib/generateId');
const { ROLES } = require('../auth');

/** Fixed test super admin — for local / staging QA only */
const TEST_SUPER_ADMIN = {
  name: 'RKLAF Super Admin',
  email: 'admin@rklaf.test',
  password: 'Admin@12345',
};

async function seedTestSuperAdmin() {
  const email = TEST_SUPER_ADMIN.email.toLowerCase();
  const hashed = await bcrypt.hash(TEST_SUPER_ADMIN.password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashed;
    existing.role = ROLES.SUPER_ADMIN;
    existing.status = 'active';
    existing.name = TEST_SUPER_ADMIN.name;
    await existing.save();
    console.log(`Test super admin ready: ${email}`);
    return;
  }

  await User.create({
    id: generateId('u'),
    name: TEST_SUPER_ADMIN.name,
    email,
    password: hashed,
    role: ROLES.SUPER_ADMIN,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: 'seed',
  });
  console.log(`Seeded test super admin: ${email}`);
}

module.exports = seedTestSuperAdmin;
module.exports.TEST_SUPER_ADMIN = TEST_SUPER_ADMIN;
