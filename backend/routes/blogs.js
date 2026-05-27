const express = require('express');
const slugify = require('slugify');
const store = require('../dataStore');
const { persist } = require('../dataStore');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', (req, res) => res.json(store.blogs));

router.post('/', protect, contentManagers, uploadImage('blogs').single('image'), (req, res) => {
  const { title, excerpt, content, author } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  const blog = {
    id: `blog-${Date.now()}`,
    title,
    slug: slugify(title, { lower: true, strict: true }),
    excerpt: excerpt || '',
    content,
    author: author || req.user.name,
    image: req.file ? `/uploads/blogs/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  store.blogs.unshift(blog);
  persist();
  res.status(201).json(blog);
});

router.delete('/:id', protect, adminOrSuper, (req, res) => {
  const idx = store.blogs.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Blog not found' });
  store.blogs.splice(idx, 1);
  persist();
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
