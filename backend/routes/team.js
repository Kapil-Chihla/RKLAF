const express = require('express');
const { TeamMember } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, superAdminOnly } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

router.get('/', async (req, res) => {
  const team = await TeamMember.find().sort({ sortOrder: 1, name: 1 }).lean();
  res.json(team);
});

router.get('/:id', async (req, res) => {
  const member = await TeamMember.findOne({ id: req.params.id }).lean();
  if (!member) return res.status(404).json({ message: 'Team member not found' });
  res.json(member);
});

router.post('/', protect, contentManagers, uploadImage.single('image'), async (req, res) => {
  const { name, role, bio, subtitle, sortOrder } = req.body;
  if (!name || !role) return res.status(400).json({ message: 'Name and role are required' });
  let image = null;
  if (req.file) image = await uploadBuffer(req.file, 'team');
  const member = await TeamMember.create({
    id: generateId('team'),
    name,
    role,
    subtitle: subtitle || '',
    bio: bio || '',
    image,
    sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
  });
  res.status(201).json(member.toObject());
});

router.put('/:id', protect, contentManagers, uploadImage.single('image'), async (req, res) => {
  const member = await TeamMember.findOne({ id: req.params.id });
  if (!member) return res.status(404).json({ message: 'Team member not found' });

  const { name, role, bio, subtitle, sortOrder, clearImage } = req.body;
  if (name?.trim()) member.name = name.trim();
  if (role?.trim()) member.role = role.trim();
  if (subtitle !== undefined) member.subtitle = subtitle;
  if (bio !== undefined) member.bio = bio;
  if (sortOrder !== undefined && sortOrder !== '') {
    const n = Number(sortOrder);
    if (Number.isFinite(n)) member.sortOrder = n;
  }
  if (clearImage === 'true') member.image = null;
  if (req.file) member.image = await uploadBuffer(req.file, 'team');

  await member.save();
  res.json(member.toObject());
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const result = await TeamMember.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Team member not found' });
  res.json({ message: 'Team member deleted' });
});

module.exports = router;
