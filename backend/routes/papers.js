const express = require('express');
const slugify = require('slugify');
const { Paper } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadPDF } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { createPdfDownloadHandler, assertPdfUpload } = require('../lib/pdfDownload');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.kind) filter.kind = req.query.kind;
  if (req.query.all !== 'true') filter.published = { $ne: false };
  const items = await Paper.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:id/download', createPdfDownloadHandler(Paper, { notFound: 'Paper not found' }));

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await Paper.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!item) return res.status(404).json({ message: 'Paper not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const { title, kind, meta, published } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  if (!['research', 'white-paper'].includes(kind)) {
    return res.status(400).json({ message: 'kind must be research or white-paper' });
  }
  const pdfErr = assertPdfUpload(req.file);
  if (pdfErr) return res.status(400).json({ message: pdfErr });

  const file = await uploadBuffer(req.file, 'papers');

  const paper = await Paper.create({
    id: generateId('paper'),
    slug: slugify(title, { lower: true, strict: true }),
    kind,
    title,
    meta: meta || '',
    file,
    published: published === 'false' ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(paper.toObject());
});

router.put('/:id', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const paper = await Paper.findOne({ id: req.params.id });
  if (!paper) return res.status(404).json({ message: 'Paper not found' });

  const { title, kind, meta, published } = req.body;
  if (title?.trim()) {
    paper.title = title.trim();
    paper.slug = slugify(title.trim(), { lower: true, strict: true });
  }
  if (kind) {
    if (!['research', 'white-paper'].includes(kind)) {
      return res.status(400).json({ message: 'kind must be research or white-paper' });
    }
    paper.kind = kind;
  }
  if (meta !== undefined) paper.meta = meta;
  if (published !== undefined) paper.published = published === 'false' ? false : true;

  if (req.file) {
    const pdfErr = assertPdfUpload(req.file);
    if (pdfErr) return res.status(400).json({ message: pdfErr });
    paper.file = await uploadBuffer(req.file, 'papers');
  }

  await paper.save();
  res.json(paper.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Paper.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Paper not found' });
  res.json({ message: 'Paper deleted' });
});

module.exports = router;
