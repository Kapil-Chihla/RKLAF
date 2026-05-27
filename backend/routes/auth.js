const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Invite } = require('../models');
const generateId = require('../lib/generateId');
const { ROLES, protect } = require('../auth');
const { signToken } = require('../utils/tokens');

const router = express.Router();

router.get('/setup-status', async (req, res) => {
  const hasSuperAdmin = await User.exists({ role: ROLES.SUPER_ADMIN });
  res.json({ needsSetup: !hasSuperAdmin, hasSuperAdmin: Boolean(hasSuperAdmin) });
});

router.post('/setup-super-admin', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (await User.exists({ role: ROLES.SUPER_ADMIN })) {
    return res.status(403).json({ message: 'Super admin already exists. Only one is allowed.' });
  }
  if (await User.exists({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    id: generateId('u'),
    name,
    email: email.toLowerCase(),
    password: hashed,
    role: ROLES.SUPER_ADMIN,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post('/register', async (req, res) => {
  const { name, email, password, inviteToken } = req.body;
  if (!name || !email || !password || !inviteToken) {
    return res.status(400).json({ message: 'Name, email, password and invite token are required' });
  }

  const invite = await Invite.findOne({
    token: inviteToken,
    status: 'pending',
    expiresAt: { $gt: new Date().toISOString() },
  });
  if (!invite) {
    return res.status(400).json({ message: 'Invalid or expired invite. Ask your super admin for a new link.' });
  }
  if (await User.exists({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    id: generateId('u'),
    name,
    email: email.toLowerCase(),
    password: hashed,
    role: invite.role,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: invite.createdBy,
  });

  invite.status = 'used';
  invite.usedAt = new Date().toISOString();
  invite.usedBy = user.id;
  await invite.save();

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).lean();
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.status === 'disabled') return res.status(403).json({ message: 'Account has been disabled' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const allowed = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR];
  if (!allowed.includes(user.role)) {
    return res.status(403).json({ message: 'You do not have admin panel access' });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findOne({ id: req.user.id }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  });
});

module.exports = router;
