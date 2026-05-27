const express = require('express');
const slugify = require('slugify');
const store = require('../dataStore');
const { persist } = require('../dataStore');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');

const router = express.Router();

router.get('/', (req, res) => res.json(store.articles));

router.post('/', protect, contentManagers, uploadAny('articles').single('file'), (req, res) => {
  const { title, summary, body } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const article = {
    id: `article-${Date.now()}`,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    summary: summary || '',
    body: body || '',
    file: req.file ? `/uploads/articles/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  store.articles.unshift(article);
  persist();
  res.status(201).json(article);
});

router.delete('/:id', protect, adminOrSuper, (req, res) => {
  const idx = store.articles.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Article not found' });
  store.articles.splice(idx, 1);
  persist();
  res.json({ message: 'Article deleted' });
});

module.exports = router;
