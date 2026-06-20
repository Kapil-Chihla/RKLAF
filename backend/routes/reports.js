const express = require('express');
const { Report } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers } = require('../auth');
const { uploadPDF } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

router.get('/', async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 }).limit(2).lean();
  res.json(reports);
});

router.post('/', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const { title, year } = req.body;
  if (!title || !req.file) return res.status(400).json({ message: 'Title and PDF file are required' });
  const file = await uploadBuffer(req.file, 'reports');
  const report = await Report.create({
    id: generateId('report'),
    title,
    year: year || '',
    file,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(report.toObject());
});

module.exports = router;
