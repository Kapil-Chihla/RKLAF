const express = require('express');
const { RunningNow } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await RunningNow.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await RunningNow.findOne({ id: req.params.id }).lean();
  if (!item) return res.status(404).json({ message: 'Running now item not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, async (req, res) => {
  const { status, title, allegation, reliefSought, stage, sortOrder, published } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

  const item = await RunningNow.create({
    id: generateId('running'),
    status: status || 'In trial',
    title: title.trim(),
    allegation: allegation || '',
    reliefSought: reliefSought || '',
    stage: stage || '',
    sortOrder: Number(sortOrder) || 0,
    published: published === 'false' || published === false ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(item.toObject());
});

router.put('/:id', protect, contentManagers, async (req, res) => {
  const item = await RunningNow.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ message: 'Running now item not found' });

  const { status, title, allegation, reliefSought, stage, sortOrder, published } = req.body;
  if (title?.trim()) item.title = title.trim();
  if (status !== undefined) item.status = status;
  if (allegation !== undefined) item.allegation = allegation;
  if (reliefSought !== undefined) item.reliefSought = reliefSought;
  if (stage !== undefined) item.stage = stage;
  if (sortOrder !== undefined) item.sortOrder = Number(sortOrder) || 0;
  if (published !== undefined) item.published = published === 'false' || published === false ? false : true;
  item.updatedAt = new Date().toISOString();

  await item.save();
  res.json(item.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await RunningNow.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Running now item not found' });
  res.json({ message: 'Running now item deleted' });
});

module.exports = router;
