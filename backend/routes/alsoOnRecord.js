const express = require('express');
const { AlsoOnRecord } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadPDF } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { createPdfDownloadHandler, assertPdfUpload } = require('../lib/pdfDownload');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await AlsoOnRecord.find(filter).sort({ sortOrder: 1, year: -1, createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:id/download', createPdfDownloadHandler(AlsoOnRecord, { notFound: 'Record not found', titleField: 'header' }));

router.get('/:id', async (req, res) => {
  const item = await AlsoOnRecord.findOne({ id: req.params.id }).lean();
  if (!item) return res.status(404).json({ message: 'Record not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const { year, header, description, statusChip, sortOrder, published } = req.body;
  if (!year?.trim()) return res.status(400).json({ message: 'Year is required' });
  if (!header?.trim()) return res.status(400).json({ message: 'Header is required' });
  const pdfErr = assertPdfUpload(req.file);
  if (pdfErr) return res.status(400).json({ message: pdfErr });

  const file = await uploadBuffer(req.file, 'also-on-record');

  const item = await AlsoOnRecord.create({
    id: generateId('record'),
    year: year.trim(),
    header: header.trim(),
    description: description || '',
    statusChip: statusChip || '',
    file,
    sortOrder: Number(sortOrder) || 0,
    published: published === 'false' || published === false ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(item.toObject());
});

router.put('/:id', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const item = await AlsoOnRecord.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ message: 'Record not found' });

  const { year, header, description, statusChip, sortOrder, published } = req.body;
  if (year?.trim()) item.year = year.trim();
  if (header?.trim()) item.header = header.trim();
  if (description !== undefined) item.description = description;
  if (statusChip !== undefined) item.statusChip = statusChip;
  if (sortOrder !== undefined) item.sortOrder = Number(sortOrder) || 0;
  if (published !== undefined) item.published = published === 'false' || published === false ? false : true;

  if (req.file) {
    const pdfErr = assertPdfUpload(req.file);
    if (pdfErr) return res.status(400).json({ message: pdfErr });
    item.file = await uploadBuffer(req.file, 'also-on-record');
  }
  item.updatedAt = new Date().toISOString();

  await item.save();
  res.json(item.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await AlsoOnRecord.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Record not found' });
  res.json({ message: 'Record deleted' });
});

module.exports = router;
