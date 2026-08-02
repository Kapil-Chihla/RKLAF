const express = require('express');
const slugify = require('slugify');
const { DeskStory } = require('../models');
const generateId = require('../lib/generateId');
const { parseCaptions } = require('../lib/contentHelpers');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

const uploadDeskMedia = uploadImage.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'gallery', maxCount: 24 },
]);

async function buildGallery(files, captionsRaw) {
  if (!files?.length) return [];
  const captions = parseCaptions(captionsRaw, files.length);
  const urls = await Promise.all(files.map((f) => uploadBuffer(f, 'desk')));
  return urls.map((url, index) => ({
    id: generateId('img'),
    url,
    caption: captions[index] || '',
    order: index,
  }));
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await DeskStory.find(filter).sort({ number: 1, createdAt: 1 }).lean();
  res.json(items);
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

router.post('/', protect, contentManagers, uploadDeskMedia, async (req, res) => {
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

  let heroImage = null;
  if (req.files?.hero?.[0]) {
    heroImage = await uploadBuffer(req.files.hero[0], 'desk');
  }
  const gallery = await buildGallery(req.files?.gallery, galleryCaptions);

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
    published: published === 'false' ? false : true,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(story.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await DeskStory.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Desk story not found' });
  res.json({ message: 'Desk story deleted' });
});

module.exports = router;
