const express = require('express');
const { Case } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', async (req, res) => {
  const cases = await Case.find().sort({ createdAt: -1 }).lean();
  res.json(cases);
});

router.post('/', protect, contentManagers, uploadImage('general').single('image'), async (req, res) => {
  const { title, description, area, status } = req.body;
  if (!title) return res.status(400).json({ message: 'Case title is required' });
  const record = await Case.create({
    id: generateId('case'),
    title,
    description: description || '',
    area: area || '',
    status: status || 'active',
    image: req.file ? `/uploads/general/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(record.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Case.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Case not found' });
  res.json({ message: 'Case deleted' });
});

module.exports = router;
