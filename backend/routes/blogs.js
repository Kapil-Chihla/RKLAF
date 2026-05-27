const express = require('express');
const slugify = require('slugify');
const { Blog } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');

const router = express.Router();

router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(blogs);
});

router.post('/', protect, contentManagers, uploadImage('blogs').single('image'), async (req, res) => {
  const { title, excerpt, content, author } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  const blog = await Blog.create({
    id: generateId('blog'),
    title,
    slug: slugify(title, { lower: true, strict: true }),
    excerpt: excerpt || '',
    content,
    author: author || req.user.name,
    image: req.file ? `/uploads/blogs/${req.file.filename}` : null,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(blog.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Blog.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
