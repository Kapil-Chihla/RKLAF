const express = require('express');
const slugify = require('slugify');
const { Article } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
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

  let file = null;
  let coverImage = null;
  const pdfFile = req.files?.file?.[0];
  const coverFile = req.files?.cover?.[0] || req.files?.image?.[0];

  if (pdfFile) file = await uploadBuffer(pdfFile, 'articles');
  if (coverFile) coverImage = await uploadBuffer(coverFile, 'articles');

  // Legacy: single 'file' field that might be image or pdf via uploadAny.single was replaced;
  // also accept if client still sends one file named file that is an image as cover only.
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

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Article.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Guide not found' });
  res.json({ message: 'Guide deleted' });
});

module.exports = router;
