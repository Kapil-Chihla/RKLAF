const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { LibraryPodcast } = require('../models');
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
const AUDIO_EXTS = new Set(['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac']);
const AUDIO_MIMES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/aac',
  'audio/flac',
]);

const uploadMediaFields = uploadAny.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'media', maxCount: 1 },
]);

function isVideoFile(file) {
  if (!file) return false;
  const ext = path.extname(file.originalname || '').toLowerCase();
  return VIDEO_MIMES.has(file.mimetype) || VIDEO_EXTS.has(ext);
}

function isAudioFile(file) {
  if (!file) return false;
  const ext = path.extname(file.originalname || '').toLowerCase();
  return AUDIO_MIMES.has(file.mimetype) || AUDIO_EXTS.has(ext);
}

function mediaOkForKind(kind, file) {
  if (!file) return true;
  if (kind === 'video') return isVideoFile(file);
  if (kind === 'audio') return isAudioFile(file) || isVideoFile(file);
  return false;
}

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.all !== 'true') filter.published = { $ne: false };
  if (req.query.kind === 'audio' || req.query.kind === 'video') {
    filter.kind = req.query.kind;
  }
  const items = await LibraryPodcast.find(filter)
    .sort({ sortOrder: -1, createdAt: -1 })
    .lean();
  res.json(items);
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await LibraryPodcast.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
  }).lean();
  if (!item) return res.status(404).json({ message: 'Podcast not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadMediaFields, async (req, res) => {
  const { title, meta, description, externalUrl, published, sortOrder, kind } = req.body;
  const podcastKind = kind === 'video' ? 'video' : kind === 'audio' ? 'audio' : null;
  if (!podcastKind) return res.status(400).json({ message: 'kind must be audio or video' });
  if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

  const mediaFile = req.files?.media?.[0];
  const thumbFile = req.files?.thumbnail?.[0];
  const external = (externalUrl || '').trim() || null;

  if (!mediaFile && !external) {
    return res.status(400).json({
      message:
        podcastKind === 'audio'
          ? 'Upload an audio file or paste a Spotify / direct audio URL'
          : 'Upload a video file or paste a YouTube / Vimeo / direct video URL',
    });
  }
  if (mediaFile && !mediaOkForKind(podcastKind, mediaFile)) {
    return res.status(400).json({
      message:
        podcastKind === 'audio'
          ? 'Audio must be mp3, m4a, wav, ogg, or aac'
          : 'Video must be mp4, webm, mov, or m4v',
    });
  }
  if (thumbFile && !thumbFile.mimetype?.startsWith('image/')) {
    return res.status(400).json({ message: 'Thumbnail must be an image (jpg, png, webp)' });
  }

  let media = null;
  if (mediaFile) media = await uploadBuffer(mediaFile, 'library-podcasts');

  let thumbnail = null;
  if (thumbFile) thumbnail = await uploadBuffer(thumbFile, 'library-podcasts');

  const orderNum = Number(sortOrder);
  const item = await LibraryPodcast.create({
    id: generateId(podcastKind === 'audio' ? 'audio' : 'vpod'),
    slug: slugify(title, { lower: true, strict: true }),
    kind: podcastKind,
    title: title.trim(),
    meta: (meta || '').trim(),
    description: (description || '').trim(),
    thumbnail,
    media,
    externalUrl: media ? null : external,
    published: published === 'false' ? false : true,
    sortOrder: Number.isFinite(orderNum) ? orderNum : Date.now(),
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(item.toObject());
});

router.put('/:id', protect, contentManagers, uploadMediaFields, async (req, res) => {
  const item = await LibraryPodcast.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ message: 'Podcast not found' });

  const {
    title,
    meta,
    description,
    externalUrl,
    published,
    sortOrder,
    kind,
    clearThumbnail,
    clearMedia,
  } = req.body;

  if (kind === 'audio' || kind === 'video') item.kind = kind;
  if (title?.trim()) {
    item.title = title.trim();
    item.slug = slugify(title.trim(), { lower: true, strict: true });
  }
  if (meta !== undefined) item.meta = String(meta).trim();
  if (description !== undefined) item.description = String(description).trim();
  if (published !== undefined) item.published = published === 'false' ? false : true;
  if (sortOrder !== undefined && sortOrder !== '') {
    const orderNum = Number(sortOrder);
    if (Number.isFinite(orderNum)) item.sortOrder = orderNum;
  }

  const mediaFile = req.files?.media?.[0];
  const thumbFile = req.files?.thumbnail?.[0];
  const external = externalUrl !== undefined ? String(externalUrl || '').trim() || null : undefined;

  if (mediaFile) {
    if (!mediaOkForKind(item.kind, mediaFile)) {
      return res.status(400).json({
        message:
          item.kind === 'audio'
            ? 'Audio must be mp3, m4a, wav, ogg, or aac'
            : 'Video must be mp4, webm, mov, or m4v',
      });
    }
    item.media = await uploadBuffer(mediaFile, 'library-podcasts');
    item.externalUrl = null;
  } else if (clearMedia === 'true') {
    item.media = null;
  }

  if (external !== undefined && !mediaFile) {
    item.externalUrl = external;
    if (external) item.media = null;
  }

  if (!item.media && !item.externalUrl) {
    return res.status(400).json({
      message: 'Keep a media file or provide an external URL',
    });
  }

  if (clearThumbnail === 'true') item.thumbnail = null;
  if (thumbFile) {
    if (!thumbFile.mimetype?.startsWith('image/')) {
      return res.status(400).json({ message: 'Thumbnail must be an image (jpg, png, webp)' });
    }
    item.thumbnail = await uploadBuffer(thumbFile, 'library-podcasts');
  }

  await item.save();
  res.json(item.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await LibraryPodcast.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Podcast not found' });
  res.json({ message: 'Podcast deleted' });
});

module.exports = router;
