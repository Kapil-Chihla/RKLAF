const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { DeskStory } = require('../models');
const generateId = require('../lib/generateId');
const { parseCaptions } = require('../lib/contentHelpers');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

const uploadDeskMedia = uploadAny.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'gallery', maxCount: 24 },
  { name: 'documents', maxCount: 12 },
]);

function isImage(file) {
  return file?.mimetype?.startsWith('image/');
}

function isPdf(file) {
  const ext = path.extname(file?.originalname || '').toLowerCase();
  return file?.mimetype === 'application/pdf' || ext === '.pdf';
}

async function buildGallery(files, captionsRaw, startOrder = 0) {
  if (!files?.length) return [];
  const images = files.filter(isImage);
  if (!images.length) return [];
  const captions = parseCaptions(captionsRaw, images.length);
  const urls = await Promise.all(images.map((f) => uploadBuffer(f, 'desk')));
  return urls.map((url, index) => ({
    id: generateId('img'),
    url,
    caption: captions[index] || '',
    order: startOrder + index,
  }));
}

async function buildDocuments(files) {
  if (!files?.length) return [];
  const pdfs = files.filter(isPdf);
  const urls = await Promise.all(pdfs.map((f) => uploadBuffer(f, 'desk-docs')));
  const now = new Date().toISOString();
  return urls.map((url, index) => ({
    id: generateId('doc'),
    url,
    name: pdfs[index].originalname || 'document.pdf',
    createdAt: now,
  }));
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await DeskStory.find(filter).sort({ number: 1, createdAt: 1 }).lean();
  res.json(items);
});

router.post('/', protect, contentManagers, uploadDeskMedia, async (req, res) => {
  try {
    const {
      title,
      kicker,
      listingDescription,
      fullHeader,
      fullBody,
      number,
      published,
      galleryCaptions,
    } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const heroFile = req.files?.hero?.[0];
    if (heroFile && !isImage(heroFile)) {
      return res.status(400).json({ message: 'Hero must be an image (jpg, png, webp)' });
    }

    let heroImage = null;
    if (heroFile) heroImage = await uploadBuffer(heroFile, 'desk');
    const gallery = await buildGallery(req.files?.gallery, galleryCaptions);
    const documents = await buildDocuments(req.files?.documents);

    const count = await DeskStory.countDocuments();
    const storyNumber = number ? parseInt(number, 10) : count + 1;

    const story = await DeskStory.create({
      id: generateId('desk'),
      slug: slugify(title, { lower: true, strict: true }),
      number: Number.isNaN(storyNumber) ? count + 1 : storyNumber,
      kicker: kicker || 'Senior Citizens',
      title,
      listingDescription: listingDescription || '',
      heroImage,
      fullHeader: fullHeader || title,
      fullBody: fullBody || '',
      gallery,
      documents,
      published: published === 'false' ? false : true,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(story.toObject());
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

router.put('/:id', protect, contentManagers, uploadDeskMedia, async (req, res) => {
  try {
    const story = await DeskStory.findOne({ id: req.params.id });
    if (!story) return res.status(404).json({ message: 'Desk story not found' });

    const {
      title,
      kicker,
      listingDescription,
      fullHeader,
      fullBody,
      number,
      published,
      galleryCaptions,
    } = req.body;

    if (title) {
      story.title = title;
      story.slug = slugify(title, { lower: true, strict: true });
    }
    if (kicker !== undefined) story.kicker = kicker;
    if (listingDescription !== undefined) story.listingDescription = listingDescription;
    if (fullHeader !== undefined) story.fullHeader = fullHeader;
    if (fullBody !== undefined) story.fullBody = fullBody;
    if (number !== undefined && number !== '') {
      const n = parseInt(number, 10);
      if (!Number.isNaN(n)) story.number = n;
    }
    if (published !== undefined) story.published = published === 'false' ? false : true;

    const heroFile = req.files?.hero?.[0];
    if (heroFile) {
      if (!isImage(heroFile)) {
        return res.status(400).json({ message: 'Hero must be an image (jpg, png, webp)' });
      }
      story.heroImage = await uploadBuffer(heroFile, 'desk');
    }

    const newGallery = await buildGallery(
      req.files?.gallery,
      galleryCaptions,
      (story.gallery || []).length,
    );
    if (newGallery.length) story.gallery = [...(story.gallery || []), ...newGallery];

    const newDocs = await buildDocuments(req.files?.documents);
    if (newDocs.length) story.documents = [...(story.documents || []), ...newDocs];

    story.updatedAt = new Date().toISOString();
    await story.save();
    res.json(story.toObject());
  } catch (err) {
    res.status(500).json({ message: err.message || 'Update failed' });
  }
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await DeskStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!item) return res.status(404).json({ message: 'Desk story not found' });
  res.json(item);
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await DeskStory.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Desk story not found' });
  res.json({ message: 'Desk story deleted' });
});

module.exports = router;
