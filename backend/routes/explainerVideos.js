const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { ExplainerVideo } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const VIDEO_MIMES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
]);

const uploadVideoFields = uploadAny.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

function isVideoFile(file) {
  if (!file) return false;
  const ext = path.extname(file.originalname || '').toLowerCase();
  return VIDEO_MIMES.has(file.mimetype) || VIDEO_EXTS.has(ext);
}

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.all !== 'true') filter.published = { $ne: false };
  const items = await ExplainerVideo.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  res.json(items);
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await ExplainerVideo.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!item) return res.status(404).json({ message: 'Video not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadVideoFields, async (req, res) => {
  const { title, meta, externalUrl, published, sortOrder } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

  const videoFile = req.files?.video?.[0];
  const thumbFile = req.files?.thumbnail?.[0];
  const external = (externalUrl || '').trim() || null;

  if (!videoFile && !external) {
    return res.status(400).json({
      message: 'Upload a video file or provide an external video URL (YouTube / Vimeo / direct link)',
    });
  }
  if (videoFile && !isVideoFile(videoFile)) {
    return res.status(400).json({ message: 'Video must be mp4, webm, mov, or m4v' });
  }
  if (thumbFile && !thumbFile.mimetype?.startsWith('image/')) {
    return res.status(400).json({ message: 'Thumbnail must be an image (jpg, png, webp)' });
  }

  let video = null;
  if (videoFile) video = await uploadBuffer(videoFile, 'videos');

  let thumbnail = null;
  if (thumbFile) thumbnail = await uploadBuffer(thumbFile, 'videos');

  const orderNum = Number(sortOrder);
  const item = await ExplainerVideo.create({
    id: generateId('video'),
    slug: slugify(title, { lower: true, strict: true }),
    title: title.trim(),
    meta: (meta || '').trim(),
    thumbnail,
    video,
    externalUrl: video ? null : external,
    published: published === 'false' ? false : true,
    sortOrder: Number.isFinite(orderNum) ? orderNum : Date.now(),
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(item.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await ExplainerVideo.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Video not found' });
  res.json({ message: 'Video deleted' });
});

module.exports = router;
