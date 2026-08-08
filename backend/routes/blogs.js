const express = require('express');
const slugify = require('slugify');
const { Blog } = require('../models');
const generateId = require('../lib/generateId');
const { parseSections } = require('../lib/contentHelpers');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.kind === 'experience') {
    filter.kind = 'experience';
  } else if (req.query.kind === 'blog') {
    // Treat missing kind as blog (legacy posts)
    filter.$or = [{ kind: 'blog' }, { kind: { $exists: false } }, { kind: null }];
  }
  if (req.query.all !== 'true') filter.published = { $ne: false };
  const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
  res.json(blogs);
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const blog = await Blog.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

router.post('/', protect, contentManagers, uploadImage.single('image'), async (req, res) => {
  const { title, excerpt, content, author, kind, sections, published } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const parsedSections = parseSections(sections);
  const body = content || parsedSections.map((s) => `${s.heading}\n\n${s.body}`).join('\n\n');
  if (!body && !parsedSections.length) {
    return res.status(400).json({ message: 'Content or sections are required' });
  }

  let image = null;
  if (req.file) image = await uploadBuffer(req.file, 'blogs');

  const blogKind = kind === 'experience' ? 'experience' : 'blog';

  const blog = await Blog.create({
    id: generateId('blog'),
    title,
    slug: slugify(title, { lower: true, strict: true }),
    excerpt: excerpt || '',
    content: body || '',
    sections: parsedSections,
    kind: blogKind,
    author: author || req.user.name,
    image,
    published: published === 'false' ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(blog.toObject());
});

router.put('/:id', protect, contentManagers, uploadImage.single('image'), async (req, res) => {
  const blog = await Blog.findOne({ id: req.params.id });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  const { title, excerpt, content, author, kind, sections, published, clearImage } = req.body;
  if (title?.trim()) {
    blog.title = title.trim();
    blog.slug = slugify(title.trim(), { lower: true, strict: true });
  }
  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (author !== undefined) blog.author = author;
  if (kind === 'experience' || kind === 'blog') blog.kind = kind;
  if (published !== undefined) blog.published = published === 'false' ? false : true;

  if (sections !== undefined) {
    const parsedSections = parseSections(sections);
    blog.sections = parsedSections;
    if (content !== undefined) {
      blog.content = content || parsedSections.map((s) => `${s.heading}\n\n${s.body}`).join('\n\n');
    } else if (parsedSections.length) {
      blog.content = parsedSections.map((s) => `${s.heading}\n\n${s.body}`).join('\n\n');
    }
  } else if (content !== undefined) {
    blog.content = content;
  }

  if (clearImage === 'true') blog.image = null;
  if (req.file) blog.image = await uploadBuffer(req.file, 'blogs');

  await blog.save();
  res.json(blog.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Blog.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
