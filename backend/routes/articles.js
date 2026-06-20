const express = require('express');
const slugify = require('slugify');
const { Article } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const ensureGuideCategory = require('../lib/ensureGuideCategory');

const router = express.Router();

router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  res.json(articles);
});

router.post('/', protect, contentManagers, uploadAny.single('file'), async (req, res) => {
  const { title, summary, body, category } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  let file = null;
  if (req.file) file = await uploadBuffer(req.file, 'articles');
  const categoryName = await ensureGuideCategory(category);
  const article = await Article.create({
    id: generateId('article'),
    title,
    slug: slugify(title, { lower: true, strict: true }),
    summary: summary || '',
    body: body || '',
    category: categoryName,
    file,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(article.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Article.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Article not found' });
  res.json({ message: 'Article deleted' });
});

module.exports = router;
