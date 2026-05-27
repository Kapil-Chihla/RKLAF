const express = require('express');
const store = require('../dataStore');
const { persist } = require('../dataStore');
const { protect, superAdminOnly, ROLES } = require('../auth');
const { inviteCode } = require('../utils/tokens');

const router = express.Router();

router.get('/', protect, superAdminOnly, (req, res) => {
  const invites = store.invites.map((i) => ({
    id: i.id,
    email: i.email,
    role: i.role,
    status: i.status,
    expiresAt: i.expiresAt,
    createdAt: i.createdAt,
    inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/register?token=${i.token}`
  }));
  res.json(invites);
});

router.post('/', protect, superAdminOnly, (req, res) => {
  const { email, role = ROLES.EDITOR, expiresInDays = 7 } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (![ROLES.ADMIN, ROLES.EDITOR].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin or editor' });
  }
  if (store.users.some((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }

  const token = inviteCode();
  const invite = {
    id: `inv-${Date.now()}`,
    email: email.toLowerCase(),
    role,
    token,
    status: 'pending',
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
  };
  store.invites.unshift(invite);
  persist();

  const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/register?token=${token}`;
  res.status(201).json({
    ...invite,
    inviteLink,
    message: 'Share this link with the team member. They can set their password when registering.'
  });
});

router.delete('/:id', protect, superAdminOnly, (req, res) => {
  const idx = store.invites.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Invite not found' });
  store.invites.splice(idx, 1);
  persist();
  res.json({ message: 'Invite removed' });
});

module.exports = router;
