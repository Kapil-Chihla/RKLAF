const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { SuccessStory } = require('../models');
const generateId = require('../lib/generateId');
const { parseCaptions, parseJsonArray } = require('../lib/contentHelpers');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { sendPdfDownload } = require('../lib/pdfDownload');

const router = express.Router();

const uploadStoryMedia = uploadAny.fields([
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
  const urls = await Promise.all(images.map((f) => uploadBuffer(f, 'success')));
  return urls.map((url, index) => ({
    id: generateId('img'),
    url,
    caption: captions[index] || '',
    order: startOrder + index,
  }));
}

async function buildDocuments(files, metaRaw) {
  if (!files?.length) return [];
  const pdfs = files.filter(isPdf);
  if (!pdfs.length) return [];
  const metaParsed = parseJsonArray(metaRaw, 'documentsMeta');
  const meta = metaParsed.ok && metaParsed.value ? metaParsed.value : [];
  const urls = await Promise.all(pdfs.map((f) => uploadBuffer(f, 'success-docs')));
  const now = new Date().toISOString();
  return urls.map((url, index) => {
    const filename = pdfs[index].originalname || 'document.pdf';
    const m = meta[index] || {};
    const custom = String(m.title || '').trim();
    return {
      id: generateId('doc'),
      url,
      name: filename,
      title: custom || filename.replace(/\.pdf$/i, ''),
      createdAt: now,
    };
  });
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await SuccessStory.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
});

/** Force a real PDF download (streamed via signed Cloudinary Admin URL). */
router.get('/:slugOrId/documents/:docId/download', async (req, res) => {
  const { slugOrId, docId } = req.params;
  const story = await SuccessStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!story) return res.status(404).json({ message: 'Success story not found' });
  const doc = (story.documents || []).find((d) => d.id === docId);
  if (!doc?.url) return res.status(404).json({ message: 'Document not found' });
  const filename = doc.name || 'document.pdf';
  return sendPdfDownload(res, doc.url, filename);
});

router.post('/', protect, contentManagers, uploadStoryMedia, async (req, res) => {
  try {
    const {
      title,
      tag,
      caption,
      caseLine,
      problem,
      action,
      result,
      fullBody,
      published,
      galleryCaptions,
    } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const heroFile = req.files?.hero?.[0];
    if (heroFile && !isImage(heroFile)) {
      return res.status(400).json({ message: 'Hero must be an image (jpg, png, webp)' });
    }

    let heroImage = null;
    if (heroFile) heroImage = await uploadBuffer(heroFile, 'success');
    const gallery = await buildGallery(req.files?.gallery, galleryCaptions);
    const documents = await buildDocuments(req.files?.documents, req.body.documentsMeta);

    const story = await SuccessStory.create({
      id: generateId('success'),
      slug: slugify(title, { lower: true, strict: true }),
      tag: tag || '',
      title,
      caption: caption || '',
      caseLine: caseLine || '',
      heroImage,
      problem: problem || '',
      action: action || '',
      result: result || '',
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

router.put('/:id', protect, contentManagers, uploadStoryMedia, async (req, res) => {
  try {
    const story = await SuccessStory.findOne({ id: req.params.id });
    if (!story) return res.status(404).json({ message: 'Success story not found' });

    const {
      title,
      tag,
      caption,
      caseLine,
      problem,
      action,
      result,
      fullBody,
      published,
      galleryCaptions,
      galleryJson,
      documentsJson,
      clearHero,
    } = req.body;

    if (title) {
      story.title = title;
      story.slug = slugify(title, { lower: true, strict: true });
    }
    if (tag !== undefined) story.tag = tag;
    if (caption !== undefined) story.caption = caption;
    if (caseLine !== undefined) story.caseLine = caseLine;
    if (problem !== undefined) story.problem = problem;
    if (action !== undefined) story.action = action;
    if (result !== undefined) story.result = result;
    if (fullBody !== undefined) story.fullBody = fullBody;
    if (published !== undefined) story.published = published === 'false' ? false : true;

    const keptGallery = parseJsonArray(galleryJson, 'galleryJson');
    if (!keptGallery.ok) return res.status(400).json({ message: keptGallery.error });
    if (keptGallery.value) {
      story.gallery = keptGallery.value.map((img, index) => ({
        id: img.id || generateId('img'),
        url: img.url,
        caption: img.caption || '',
        order: index,
      }));
    }

    const keptDocs = parseJsonArray(documentsJson, 'documentsJson');
    if (!keptDocs.ok) return res.status(400).json({ message: keptDocs.error });
    if (keptDocs.value) {
      story.documents = keptDocs.value.map((doc) => ({
        id: doc.id || generateId('doc'),
        url: doc.url,
        name: doc.name || 'document.pdf',
        title: String(doc.title || '').trim() || String(doc.name || '').replace(/\.pdf$/i, ''),
        createdAt: doc.createdAt || new Date().toISOString(),
      }));
    }

    if (clearHero === 'true' || clearHero === true) {
      story.heroImage = null;
    }

    const heroFile = req.files?.hero?.[0];
    if (heroFile) {
      if (!isImage(heroFile)) {
        return res.status(400).json({ message: 'Hero must be an image (jpg, png, webp)' });
      }
      story.heroImage = await uploadBuffer(heroFile, 'success');
    }

    const newGallery = await buildGallery(
      req.files?.gallery,
      galleryCaptions,
      (story.gallery || []).length,
    );
    if (newGallery.length) story.gallery = [...(story.gallery || []), ...newGallery];

    const newDocs = await buildDocuments(req.files?.documents, req.body.documentsMeta);
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
  const item = await SuccessStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!item) return res.status(404).json({ message: 'Success story not found' });
  res.json(item);
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await SuccessStory.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Success story not found' });
  res.json({ message: 'Success story deleted' });
});

module.exports = router;
