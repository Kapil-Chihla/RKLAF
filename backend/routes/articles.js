const express = require('express');
const slugify = require('slugify');
const { Article } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { createPdfDownloadHandler, assertPdfUpload } = require('../lib/pdfDownload');
const ensureGuideCategory = require('../lib/ensureGuideCategory');

const router = express.Router();

const uploadGuide = uploadAny.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  res.json(articles);
});

router.get(
  '/:id/download',
  createPdfDownloadHandler(Article, { notFound: 'Guide not found' }),
);

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const article = await Article.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!article) return res.status(404).json({ message: 'Guide not found' });
  res.json(article);
});

router.post('/', protect, contentManagers, uploadGuide, async (req, res) => {
  const { title, summary, body, category } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const pdfFile = req.files?.file?.[0];
  const coverFile = req.files?.cover?.[0] || req.files?.image?.[0];

  const pdfErr = assertPdfUpload(pdfFile);
  if (pdfErr) {
    return res.status(400).json({
      message: pdfErr === 'PDF file is required' ? 'PDF file is required for practical guides' : pdfErr,
    });
  }
  if (coverFile && !coverFile.mimetype?.startsWith('image/')) {
    return res.status(400).json({ message: 'Cover must be an image (jpg, png, webp)' });
  }

  const file = await uploadBuffer(pdfFile, 'articles');
  let coverImage = null;
  if (coverFile) coverImage = await uploadBuffer(coverFile, 'articles');

  const categoryName = await ensureGuideCategory(category);
  const article = await Article.create({
    id: generateId('article'),
    title,
    slug: slugify(title, { lower: true, strict: true }),
    summary: summary || '',
    body: body || '',
    category: categoryName,
    coverImage,
    file,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(article.toObject());
});

router.put('/:id', protect, contentManagers, uploadGuide, async (req, res) => {
  const article = await Article.findOne({ id: req.params.id });
  if (!article) return res.status(404).json({ message: 'Guide not found' });

  const { title, summary, body, category, clearCover } = req.body;
  if (title?.trim()) {
    article.title = title.trim();
    article.slug = slugify(title.trim(), { lower: true, strict: true });
  }
  if (summary !== undefined) article.summary = summary;
  if (body !== undefined) article.body = body;
  if (category !== undefined) {
    article.category = await ensureGuideCategory(category);
  }

  const pdfFile = req.files?.file?.[0];
  const coverFile = req.files?.cover?.[0] || req.files?.image?.[0];

  if (pdfFile) {
    if (!pdfFile.mimetype?.includes('pdf') && !pdfFile.originalname?.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ message: 'File must be a PDF' });
    }
    article.file = await uploadBuffer(pdfFile, 'articles');
  }
  if (clearCover === 'true') article.coverImage = null;
  if (coverFile) {
    if (!coverFile.mimetype?.startsWith('image/')) {
      return res.status(400).json({ message: 'Cover must be an image (jpg, png, webp)' });
    }
    article.coverImage = await uploadBuffer(coverFile, 'articles');
  }

  await article.save();
  res.json(article.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Article.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Guide not found' });
  res.json({ message: 'Guide deleted' });
});

module.exports = router;
