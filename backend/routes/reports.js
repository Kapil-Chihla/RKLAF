const express = require('express');
const { Report } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers } = require('../auth');
const { uploadPDF } = require('../upload');

const router = express.Router();

router.get('/', async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 }).limit(2).lean();
  res.json(reports);
});

router.post('/', protect, contentManagers, uploadPDF('reports').single('file'), async (req, res) => {
  const { title, year } = req.body;
  if (!title || !req.file) return res.status(400).json({ message: 'Title and PDF file are required' });
  const report = await Report.create({
    id: generateId('report'),
    title,
    year: year || '',
    file: `/uploads/reports/${req.file.filename}`,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(report.toObject());
});

module.exports = router;
