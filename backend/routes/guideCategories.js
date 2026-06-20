const express = require('express');
const slugify = require('slugify');
const { GuideCategory, Article } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers } = require('../auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await GuideCategory.find().sort({ name: 1 }).lean();
  res.json(categories);
});

router.get('/published', async (req, res) => {
  const names = await Article.distinct('category', { file: { $nin: [null, ''] } });
  const normalized = [...new Set(names.map((n) => (n || 'General').trim()).filter(Boolean))];
  if (normalized.length === 0) return res.json([]);

  const stored = await GuideCategory.find({ name: { $in: normalized } }).sort({ name: 1 }).lean();
  const known = new Set(stored.map((c) => c.name));
  const legacy = normalized
    .filter((name) => !known.has(name))
    .map((name) => ({
      id: slugify(name, { lower: true, strict: true }),
      name,
      slug: slugify(name, { lower: true, strict: true }),
    }));

  res.json([...stored, ...legacy].sort((a, b) => a.name.localeCompare(b.name)));
});

router.post('/', protect, contentManagers, async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  const existing = await GuideCategory.findOne({ name }).lean();
  if (existing) return res.json(existing);

  const category = await GuideCategory.create({
    id: generateId('cat'),
    name,
    slug: slugify(name, { lower: true, strict: true }),
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(category.toObject());
});

module.exports = router;
