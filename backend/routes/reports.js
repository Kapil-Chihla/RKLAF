const express = require('express');
const store = require('../dataStore');
const { persist } = require('../dataStore');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadPDF } = require('../upload');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.reports.slice(0, 2));
});

router.post('/', protect, contentManagers, uploadPDF('reports').single('file'), (req, res) => {
  const { title, year } = req.body;
  if (!title || !req.file) return res.status(400).json({ message: 'Title and PDF file are required' });
  const report = {
    id: `report-${Date.now()}`,
    title,
    year: year || '',
    file: `/uploads/reports/${req.file.filename}`,
    createdAt: new Date().toISOString()
  };
  store.reports.unshift(report);
  persist();
  res.status(201).json(report);
});

module.exports = router;
