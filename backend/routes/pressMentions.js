const express = require('express');
const path = require('path');
const { PressMention } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, superAdminOnly } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { sendPdfDownload, assertPdfUpload } = require('../lib/pdfDownload');

const router = express.Router();

const LAYOUTS = ['clip', 'link', 'image', 'quote', 'video', 'pdf'];
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const VIDEO_MIMES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
]);

const uploadPressMedia = uploadAny.fields([
  { name: 'image', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

function isImage(file) {
  return file?.mimetype?.startsWith('image/');
}

function isVideoFile(file) {
  if (!file) return false;
  const ext = path.extname(file.originalname || '').toLowerCase();
  return VIDEO_MIMES.has(file.mimetype) || VIDEO_EXTS.has(ext);
}

function pickLayout(layout) {
  return LAYOUTS.includes(layout) ? layout : 'clip';
}

function validateForLayout(layout, { url, youtubeUrl, quote, imageFile, videoFile, pdfFile, hasImage, hasVideo, hasPdf }) {
  if (layout === 'link' && !(url || '').trim()) {
    return 'External press URL is required for link layout';
  }
  if (layout === 'quote' && !(quote || '').trim()) {
    return 'Quote text is required for quote layout';
  }
  if (layout === 'image' && !imageFile && !hasImage) {
    return 'Image is required for image layout';
  }
  if (layout === 'video' && !videoFile && !(youtubeUrl || '').trim() && !hasVideo) {
    return 'Upload a video file or provide a YouTube / Vimeo URL';
  }
  if (layout === 'pdf' && !pdfFile && !hasPdf) {
    return 'PDF is required for pdf layout';
  }
  if (videoFile && !isVideoFile(videoFile)) {
    return 'Video must be mp4, webm, mov, or m4v';
  }
  if (imageFile && !isImage(imageFile)) {
    return 'Image must be jpg, png, or webp';
  }
  if (pdfFile) {
    const pdfErr = assertPdfUpload(pdfFile);
    if (pdfErr) return pdfErr;
  }
  return null;
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  if (req.query.layout && LAYOUTS.includes(req.query.layout)) {
    filter.layout = req.query.layout;
  }
  const items = await PressMention.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:id/pdf/download', async (req, res) => {
  const item = await PressMention.findOne({ id: req.params.id }).lean();
  if (!item) return res.status(404).json({ message: 'Press mention not found' });
  if (!item.pdf) return res.status(404).json({ message: 'No PDF uploaded for this item' });
  return sendPdfDownload(res, item.pdf, `${item.title || 'press'}.pdf`);
});

router.get('/:id', async (req, res) => {
  const item = await PressMention.findOne({ id: req.params.id }).lean();
  if (!item) return res.status(404).json({ message: 'Press mention not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadPressMedia, async (req, res) => {
  try {
    const {
      outlet,
      title,
      meta,
      url,
      imageCaption,
      quote,
      quoteAttribution,
      youtubeUrl,
      layout,
      sortOrder,
      published,
    } = req.body;

    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

    const resolvedLayout = pickLayout(layout);
    const imageFile = req.files?.image?.[0];
    const thumbFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];
    const pdfFile = req.files?.pdf?.[0];

    const err = validateForLayout(resolvedLayout, {
      url,
      youtubeUrl,
      quote,
      imageFile,
      videoFile,
      pdfFile,
      hasImage: false,
      hasVideo: false,
      hasPdf: false,
    });
    if (err) return res.status(400).json({ message: err });

    if (thumbFile && !isImage(thumbFile)) {
      return res.status(400).json({ message: 'Thumbnail must be an image (jpg, png, webp)' });
    }

    let image = null;
    let thumbnail = null;
    let video = null;
    let pdf = null;
    if (imageFile) image = await uploadBuffer(imageFile, 'press');
    if (thumbFile) thumbnail = await uploadBuffer(thumbFile, 'press');
    if (videoFile) video = await uploadBuffer(videoFile, 'press-videos');
    if (pdfFile) pdf = await uploadBuffer(pdfFile, 'press-pdfs');

    const item = await PressMention.create({
      id: generateId('press'),
      layout: resolvedLayout,
      outlet: outlet || '',
      title: title.trim(),
      meta: meta || '',
      url: url || '',
      image,
      imageCaption: imageCaption || '',
      quote: quote || '',
      quoteAttribution: quoteAttribution || '',
      video,
      youtubeUrl: youtubeUrl || '',
      thumbnail,
      pdf,
      sortOrder: Number(sortOrder) || 0,
      published: published === 'false' || published === false ? false : true,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(item.toObject());
  } catch (e) {
    res.status(500).json({ message: e.message || 'Upload failed' });
  }
});

router.put('/:id', protect, contentManagers, uploadPressMedia, async (req, res) => {
  try {
    const item = await PressMention.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Press mention not found' });

    const {
      outlet,
      title,
      meta,
      url,
      imageCaption,
      quote,
      quoteAttribution,
      youtubeUrl,
      layout,
      sortOrder,
      published,
      clearImage,
      clearThumbnail,
      clearVideo,
      clearPdf,
    } = req.body;

    if (title?.trim()) item.title = title.trim();
    if (outlet !== undefined) item.outlet = outlet;
    if (meta !== undefined) item.meta = meta;
    if (url !== undefined) item.url = url;
    if (imageCaption !== undefined) item.imageCaption = imageCaption;
    if (quote !== undefined) item.quote = quote;
    if (quoteAttribution !== undefined) item.quoteAttribution = quoteAttribution;
    if (youtubeUrl !== undefined) item.youtubeUrl = youtubeUrl;
    if (layout !== undefined) item.layout = pickLayout(layout);
    if (sortOrder !== undefined) item.sortOrder = Number(sortOrder) || 0;
    if (published !== undefined) {
      item.published = published === 'false' || published === false ? false : true;
    }

    const imageFile = req.files?.image?.[0];
    const thumbFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];
    const pdfFile = req.files?.pdf?.[0];

    if (clearImage === 'true' && !imageFile) item.image = null;
    if (clearThumbnail === 'true' && !thumbFile) item.thumbnail = null;
    if (clearVideo === 'true' && !videoFile) item.video = null;
    if (clearPdf === 'true' && !pdfFile) item.pdf = null;

    if (imageFile) {
      if (!isImage(imageFile)) return res.status(400).json({ message: 'Image must be jpg, png, or webp' });
      item.image = await uploadBuffer(imageFile, 'press');
    }
    if (thumbFile) {
      if (!isImage(thumbFile)) {
        return res.status(400).json({ message: 'Thumbnail must be an image (jpg, png, webp)' });
      }
      item.thumbnail = await uploadBuffer(thumbFile, 'press');
    }
    if (videoFile) {
      if (!isVideoFile(videoFile)) {
        return res.status(400).json({ message: 'Video must be mp4, webm, mov, or m4v' });
      }
      item.video = await uploadBuffer(videoFile, 'press-videos');
    }
    if (pdfFile) {
      const pdfErr = assertPdfUpload(pdfFile);
      if (pdfErr) return res.status(400).json({ message: pdfErr });
      item.pdf = await uploadBuffer(pdfFile, 'press-pdfs');
    }

    const err = validateForLayout(item.layout, {
      url: item.url,
      youtubeUrl: item.youtubeUrl,
      quote: item.quote,
      imageFile: null,
      videoFile: null,
      pdfFile: null,
      hasImage: Boolean(item.image),
      hasVideo: Boolean(item.video || item.youtubeUrl),
      hasPdf: Boolean(item.pdf),
    });
    if (err) return res.status(400).json({ message: err });

    item.updatedAt = new Date().toISOString();
    await item.save();
    res.json(item.toObject());
  } catch (e) {
    res.status(500).json({ message: e.message || 'Update failed' });
  }
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const result = await PressMention.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Press mention not found' });
  res.json({ message: 'Press mention deleted' });
});

module.exports = router;
