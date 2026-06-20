const express = require('express');
const slugify = require('slugify');
const { Blog } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(blogs);
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const blog = await Blog.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

router.post('/', protect, contentManagers, uploadImage.single('image'), async (req, res) => {
  const { title, excerpt, content, author } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  let image = null;
  if (req.file) image = await uploadBuffer(req.file, 'blogs');
  const blog = await Blog.create({
    id: generateId('blog'),
    title,
    slug: slugify(title, { lower: true, strict: true }),
    excerpt: excerpt || '',
    content,
    author: author || req.user.name,
    image,
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
