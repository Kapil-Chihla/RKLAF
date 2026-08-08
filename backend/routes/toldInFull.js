const express = require('express');
const slugify = require('slugify');
const { ToldInFull } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await ToldInFull.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await ToldInFull.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!item) return res.status(404).json({ message: 'Told in full story not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadImage.single('hero'), async (req, res) => {
  const { title, tag, caption, problem, action, result, sortOrder, published } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

  let heroImage = null;
  if (req.file) heroImage = await uploadBuffer(req.file, 'told-in-full');

  const item = await ToldInFull.create({
    id: generateId('told'),
    slug: slugify(title.trim(), { lower: true, strict: true }),
    tag: tag || '',
    title: title.trim(),
    caption: caption || '',
    heroImage,
    problem: problem || '',
    action: action || '',
    result: result || '',
    sortOrder: Number(sortOrder) || 0,
    published: published === 'false' || published === false ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(item.toObject());
});

router.put('/:id', protect, contentManagers, uploadImage.single('hero'), async (req, res) => {
  const item = await ToldInFull.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ message: 'Told in full story not found' });

  const { title, tag, caption, problem, action, result, sortOrder, published, clearHero } = req.body;
  if (title?.trim()) {
    item.title = title.trim();
    item.slug = slugify(title.trim(), { lower: true, strict: true });
  }
  if (tag !== undefined) item.tag = tag;
  if (caption !== undefined) item.caption = caption;
  if (problem !== undefined) item.problem = problem;
  if (action !== undefined) item.action = action;
  if (result !== undefined) item.result = result;
  if (sortOrder !== undefined) item.sortOrder = Number(sortOrder) || 0;
  if (published !== undefined) item.published = published === 'false' || published === false ? false : true;
  if (clearHero === 'true') item.heroImage = null;
  if (req.file) item.heroImage = await uploadBuffer(req.file, 'told-in-full');
  item.updatedAt = new Date().toISOString();

  await item.save();
  res.json(item.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await ToldInFull.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Told in full story not found' });
  res.json({ message: 'Told in full story deleted' });
});

module.exports = router;
