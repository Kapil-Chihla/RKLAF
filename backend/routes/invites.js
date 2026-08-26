const express = require('express');
const { User, Invite } = require('../models');
const generateId = require('../lib/generateId');
const { protect, superAdminOnly, ROLES } = require('../auth');
const { inviteCode } = require('../utils/tokens');

const router = express.Router();

/** Prefer the site the admin is on (Origin), then FRONTEND_URL, then localhost */
function frontendBase(req) {
  const originHeader = req.get('origin');
  if (originHeader) {
    try {
      return new URL(originHeader).origin;
    } catch {
      /* ignore */
    }
  }
  const referer = req.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      /* ignore */
    }
  }
  const fromEnv = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
  return fromEnv || 'http://localhost:5173';
}

function inviteLink(req, token) {
  return `${frontendBase(req)}/admin/register?token=${token}`;
}

router.get('/', protect, superAdminOnly, async (req, res) => {
  const invites = await Invite.find().sort({ createdAt: -1 }).lean();
  res.json(
    invites.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.status,
      expiresAt: i.expiresAt,
      createdAt: i.createdAt,
      token: i.token,
      inviteLink: inviteLink(req, i.token),
    }))
  );
});

router.post('/', protect, superAdminOnly, async (req, res) => {
  const { email, role = ROLES.EDITOR, expiresInDays = 7 } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (![ROLES.ADMIN, ROLES.EDITOR].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin or editor' });
  }
  if (await User.exists({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }

  const token = inviteCode();
  const invite = await Invite.create({
    id: generateId('inv'),
    email: email.toLowerCase(),
    role,
    token,
    status: 'pending',
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
  });

  const link = inviteLink(req, token);
  res.status(201).json({
    ...invite.toObject(),
    inviteLink: link,
    message: 'Share this link with the team member. They can set their password when registering.',
  });
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const result = await Invite.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Invite not found' });
  res.json({ message: 'Invite removed' });
});

module.exports = router;
