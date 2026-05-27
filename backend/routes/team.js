const express = require('express');
const store = require('../dataStore');
const { protect, adminOnly } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', (req, res) => res.json(store.team));

router.post('/', protect, adminOnly, uploadImage('team').single('image'), (req, res) => {
  const { name, role, bio } = req.body;
  if (!name || !role) return res.status(400).json({ message: 'Name and role are required' });
  const member = {
    id: `team-${Date.now()}`,
    name,
    role,
    bio: bio || '',
    image: req.file ? `/uploads/team/${req.file.filename}` : null
  };
  store.team.push(member);
  res.status(201).json(member);
});

module.exports = router;
