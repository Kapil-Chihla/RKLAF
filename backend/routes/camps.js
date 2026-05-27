const express = require('express');
const { Camp } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', async (req, res) => {
  const camps = await Camp.find().sort({ createdAt: -1 }).lean();
  res.json(camps);
});

router.post('/', protect, contentManagers, uploadImage('general').single('image'), async (req, res) => {
  const { title, location, date, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Camp title is required' });
  const camp = await Camp.create({
    id: generateId('camp'),
    title,
    location: location || '',
    date: date || '',
    description: description || '',
    image: req.file ? `/uploads/general/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(camp.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Camp.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Camp not found' });
  res.json({ message: 'Camp deleted' });
});

module.exports = router;
