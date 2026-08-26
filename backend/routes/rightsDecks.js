const express = require('express');
const slugify = require('slugify');
const { RightsDeck } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, superAdminOnly } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { createPdfDownloadHandler, assertPdfUpload } = require('../lib/pdfDownload');

const router = express.Router();

const uploadDeckFields = uploadAny.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

function pdfFileFromReq(req) {
  return req.files?.pdf?.[0] || req.files?.file?.[0] || null;
}

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.all !== 'true') filter.published = { $ne: false };
  const items = await RightsDeck.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.get(
  '/:id/download',
  createPdfDownloadHandler(RightsDeck, { notFound: 'Deck not found', fileField: 'pdf' }),
);

router.get(
  '/:id/view',
  createPdfDownloadHandler(RightsDeck, {
    notFound: 'Deck not found',
    fileField: 'pdf',
    inline: true,
  }),
);

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await RightsDeck.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!item) return res.status(404).json({ message: 'Deck not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadDeckFields, async (req, res) => {
  const { title, smallTitle, category, description, slideCount, published } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

  const bannerFile = req.files?.banner?.[0];
  const pdfFile = pdfFileFromReq(req);

  if (bannerFile && !bannerFile.mimetype?.startsWith('image/')) {
    return res.status(400).json({ message: 'Banner must be an image (jpg, png, webp)' });
  }
  if (pdfFile) {
    const pdfErr = assertPdfUpload(pdfFile);
    if (pdfErr) return res.status(400).json({ message: pdfErr });
  }

  let banner = null;
  if (bannerFile) banner = await uploadBuffer(bannerFile, 'rights-decks');

  let pdf = null;
  if (pdfFile) pdf = await uploadBuffer(pdfFile, 'rights-decks');

  const slides = slideCount !== undefined && slideCount !== '' ? Number(slideCount) : null;

  const item = await RightsDeck.create({
    id: generateId('deck'),
    slug: slugify(title, { lower: true, strict: true }),
    category: (category || '').trim(),
    smallTitle: (smallTitle || '').trim(),
    title: title.trim(),
    description: (description || '').trim(),
    banner,
    pdf,
    slideCount: Number.isFinite(slides) && slides > 0 ? slides : null,
    published: published === 'false' ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(item.toObject());
});

router.put('/:id', protect, contentManagers, uploadDeckFields, async (req, res) => {
  const item = await RightsDeck.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ message: 'Deck not found' });

  const {
    title,
    smallTitle,
    category,
    description,
    slideCount,
    published,
    clearBanner,
    clearPdf,
  } = req.body;

  if (title?.trim()) {
    item.title = title.trim();
    item.slug = slugify(title.trim(), { lower: true, strict: true });
  }
  if (smallTitle !== undefined) item.smallTitle = String(smallTitle).trim();
  if (category !== undefined) item.category = String(category).trim();
  if (description !== undefined) item.description = String(description).trim();
  if (published !== undefined) item.published = published === 'false' ? false : true;
  if (slideCount !== undefined) {
    if (slideCount === '' || slideCount === null) {
      item.slideCount = null;
    } else {
      const slides = Number(slideCount);
      item.slideCount = Number.isFinite(slides) && slides > 0 ? slides : null;
    }
  }

  const bannerFile = req.files?.banner?.[0];
  const pdfFile = pdfFileFromReq(req);

  if (clearBanner === 'true' && !bannerFile) item.banner = null;
  if (bannerFile) {
    if (!bannerFile.mimetype?.startsWith('image/')) {
      return res.status(400).json({ message: 'Banner must be an image (jpg, png, webp)' });
    }
    item.banner = await uploadBuffer(bannerFile, 'rights-decks');
  }

  if (clearPdf === 'true' && !pdfFile) item.pdf = null;
  if (pdfFile) {
    const pdfErr = assertPdfUpload(pdfFile);
    if (pdfErr) return res.status(400).json({ message: pdfErr });
    item.pdf = await uploadBuffer(pdfFile, 'rights-decks');
  }

  await item.save();
  res.json(item.toObject());
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const result = await RightsDeck.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Deck not found' });
  res.json({ message: 'Deck deleted' });
});

module.exports = router;
