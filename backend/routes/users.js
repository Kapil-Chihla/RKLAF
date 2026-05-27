const express = require('express');
const { User } = require('../models');
const { protect, superAdminOnly, ROLES } = require('../auth');

const router = express.Router();

const sanitize = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status,
  createdAt: u.createdAt,
  createdBy: u.createdBy,
});

router.get('/', protect, superAdminOnly, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json(users.map(sanitize));
});

router.patch('/:id', protect, superAdminOnly, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === ROLES.SUPER_ADMIN && req.user.id !== user.id) {
    return res.status(403).json({ message: 'Cannot modify another super admin' });
  }

  const { role, status } = req.body;
  if (role) {
    if (user.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Super admin role cannot be changed' });
    }
    if (![ROLES.ADMIN, ROLES.EDITOR].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    user.role = role;
  }
  if (status) {
    if (user.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Cannot disable super admin' });
    }
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    user.status = status;
  }
  await user.save();
  res.json(sanitize(user.toObject()));
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === ROLES.SUPER_ADMIN) {
    return res.status(403).json({ message: 'Cannot remove super admin' });
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

module.exports = router;
