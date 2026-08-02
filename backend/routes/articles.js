const express = require('express');
const slugify = require('slugify');
const path = require('path');
const { Article } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer, cloudinaryAttachmentUrl } = require('../lib/cloudinaryUpload');
const ensureGuideCategory = require('../lib/ensureGuideCategory');

const router = express.Router();

const uploadGuide = uploadAny.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

function isPdfFile(file) {
  if (!file) return false;
  const ext = path.extname(file.originalname || '').toLowerCase();
  return file.mimetype === 'application/pdf' || ext === '.pdf';
}

router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  res.json(articles);
});

/** Force PDF download with a proper .pdf filename (Cloudinary fl_attachment). */
router.get('/:id/download', async (req, res) => {
  const article = await Article.findOne({
    $or: [{ id: req.params.id }, { slug: req.params.id }],
  }).lean();
  if (!article) return res.status(404).json({ message: 'Guide not found' });
  if (!article.file) return res.status(404).json({ message: 'No PDF uploaded for this guide' });

  const filename = `${slugify(article.title || 'guide', { lower: true, strict: true }) || 'guide'}.pdf`;
  const url = cloudinaryAttachmentUrl(article.file, filename);
  return res.redirect(302, url);
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

  const pdfFile = req.files?.file?.[0];
  const coverFile = req.files?.cover?.[0] || req.files?.image?.[0];

  if (!pdfFile) {
    return res.status(400).json({ message: 'PDF file is required for practical guides' });
  }
  if (!isPdfFile(pdfFile)) {
    return res.status(400).json({ message: 'The file must be a PDF (.pdf)' });
  }
  if (coverFile && !coverFile.mimetype?.startsWith('image/')) {
    return res.status(400).json({ message: 'Cover must be an image (jpg, png, webp)' });
  }

  const file = await uploadBuffer(pdfFile, 'articles');
  let coverImage = null;
  if (coverFile) coverImage = await uploadBuffer(coverFile, 'articles');

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
