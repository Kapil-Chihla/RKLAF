const express = require('express');
const store = require('../dataStore');
const { persist } = require('../dataStore');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', (req, res) => res.json(store.cases));

router.post('/', protect, contentManagers, uploadImage('general').single('image'), (req, res) => {
  const { title, description, area, status } = req.body;
  if (!title) return res.status(400).json({ message: 'Case title is required' });
  const record = {
    id: `case-${Date.now()}`,
    title,
    description: description || '',
    area: area || '',
    status: status || 'active',
    image: req.file ? `/uploads/general/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  store.cases.unshift(record);
  persist();
  res.status(201).json(record);
});

router.delete('/:id', protect, adminOrSuper, (req, res) => {
  const idx = store.cases.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Case not found' });
  store.cases.splice(idx, 1);
  persist();
  res.json({ message: 'Case deleted' });
});

module.exports = router;
