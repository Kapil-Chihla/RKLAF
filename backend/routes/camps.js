const express = require('express');
const store = require('../dataStore');
const { persist } = require('../dataStore');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', (req, res) => res.json(store.camps));

router.post('/', protect, contentManagers, uploadImage('general').single('image'), (req, res) => {
  const { title, location, date, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Camp title is required' });
  const camp = {
    id: `camp-${Date.now()}`,
    title,
    location: location || '',
    date: date || '',
    description: description || '',
    image: req.file ? `/uploads/general/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  store.camps.unshift(camp);
  persist();
  res.status(201).json(camp);
});

router.delete('/:id', protect, adminOrSuper, (req, res) => {
  const idx = store.camps.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Camp not found' });
  store.camps.splice(idx, 1);
  persist();
  res.json({ message: 'Camp deleted' });
});

module.exports = router;
