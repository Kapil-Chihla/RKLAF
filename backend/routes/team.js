const express = require('express');
const { TeamMember } = require('../models');
const generateId = require('../lib/generateId');
const { protect, adminOnly } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

router.get('/', async (req, res) => {
  const team = await TeamMember.find().lean();
  res.json(team);
});

router.post('/', protect, adminOnly, uploadImage.single('image'), async (req, res) => {
  const { name, role, bio } = req.body;
  if (!name || !role) return res.status(400).json({ message: 'Name and role are required' });
  let image = null;
  if (req.file) image = await uploadBuffer(req.file, 'team');
  const member = await TeamMember.create({
    id: generateId('team'),
    name,
    role,
    bio: bio || '',
    image,
  });
  res.status(201).json(member.toObject());
});

module.exports = router;
