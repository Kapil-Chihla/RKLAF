const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { DeskStory } = require('../models');
const generateId = require('../lib/generateId');
const { parseCaptions, parseJsonArray } = require('../lib/contentHelpers');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { sendPdfDownload } = require('../lib/pdfDownload');

const router = express.Router();

const uploadDeskMedia = uploadAny.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'gallery', maxCount: 24 },
  { name: 'documents', maxCount: 12 },
  { name: 'documentCovers', maxCount: 12 },
]);

function isImage(file) {
  return file?.mimetype?.startsWith('image/');
}

function isPdf(file) {
  const ext = path.extname(file?.originalname || '').toLowerCase();
  return file?.mimetype === 'application/pdf' || ext === '.pdf';
}

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.split('?')[0].replace(/\/$/, '');
}

function parseAfterParagraphs(raw, count) {
  const lines = parseCaptions(raw, count);
  return lines.map((line) => {
    if (line === '' || line == null) return null;
    const n = parseInt(line, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  });
}

function normalizeAfterParagraph(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function buildGallery(files, captionsRaw, afterRaw, startOrder = 0) {
  if (!files?.length) return [];
  const images = files.filter(isImage);
  if (!images.length) return [];
  const captions = parseCaptions(captionsRaw, images.length);
  const afters = parseAfterParagraphs(afterRaw, images.length);
  const urls = await Promise.all(images.map((f) => uploadBuffer(f, 'desk')));
  return urls.map((url, index) => ({
    id: generateId('img'),
    url,
    caption: captions[index] || '',
    afterParagraph: afters[index],
    order: startOrder + index,
  }));
}

async function buildDocuments(files, metaRaw, coverFiles) {
  if (!files?.length) return [];
  const pdfs = files.filter(isPdf);
  if (!pdfs.length) return [];
  const metaParsed = parseJsonArray(metaRaw, 'documentsMeta');
  const meta = metaParsed.ok && metaParsed.value ? metaParsed.value : [];
  const covers = (coverFiles || []).filter(isImage);
  const urls = await Promise.all(pdfs.map((f) => uploadBuffer(f, 'desk-docs')));
  const coverUrls = await Promise.all(
    pdfs.map((_, index) => (covers[index] ? uploadBuffer(covers[index], 'desk-docs') : Promise.resolve(null))),
  );
  const now = new Date().toISOString();
  return urls.map((url, index) => {
    const m = meta[index] || {};
    const filename = pdfs[index].originalname || 'document.pdf';
    return {
      id: generateId('doc'),
      url,
      name: filename,
      title: String(m.title || '').trim() || filename.replace(/\.pdf$/i, ''),
      description: String(m.description || '').trim(),
      coverImage: coverUrls[index] || null,
      createdAt: now,
    };
  });
}

function mapKeptGallery(items) {
  return (items || []).map((img, index) => ({
    id: img.id || generateId('img'),
    url: img.url,
    caption: img.caption || '',
    afterParagraph: normalizeAfterParagraph(img.afterParagraph),
    order: index,
  }));
}

function mapKeptDocuments(items) {
  return (items || []).map((doc) => ({
    id: doc.id || generateId('doc'),
    url: doc.url,
    name: doc.name || 'document.pdf',
    title: String(doc.title || '').trim(),
    description: String(doc.description || '').trim(),
    coverImage: doc.coverImage || null,
    createdAt: doc.createdAt || new Date().toISOString(),
  }));
}

/** Drop gallery entries that duplicate the hero URL. */
function dedupeGalleryAgainstHero(gallery, heroImage) {
  const hero = normalizeUrl(heroImage);
  if (!hero) return gallery || [];
  return (gallery || []).filter((img) => normalizeUrl(img.url) !== hero);
}

/** Keep project numbers sequential 1..n after deletes / gaps. */
async function renumberDeskStories() {
  const items = await DeskStory.find({}).sort({ number: 1, createdAt: 1 });
  await Promise.all(
    items.map((item, index) => {
      const next = index + 1;
      if (item.number === next) return null;
      item.number = next;
      item.updatedAt = new Date().toISOString();
      return item.save();
    }),
  );
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await DeskStory.find(filter).sort({ number: 1, createdAt: 1 }).lean();
  res.json(items);
});

/** Force a real PDF download (streamed via signed Cloudinary Admin URL). */
router.get('/:slugOrId/documents/:docId/download', async (req, res) => {
  const { slugOrId, docId } = req.params;
  const story = await DeskStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!story) return res.status(404).json({ message: 'Desk story not found' });
  const doc = (story.documents || []).find((d) => d.id === docId);
  if (!doc?.url) return res.status(404).json({ message: 'Document not found' });
  const filename = doc.name || doc.title || 'document.pdf';
  return sendPdfDownload(res, doc.url, filename);
});

router.get('/:slugOrId/documents/:docId/view', async (req, res) => {
  const { slugOrId, docId } = req.params;
  const story = await DeskStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!story) return res.status(404).json({ message: 'Desk story not found' });
  const doc = (story.documents || []).find((d) => d.id === docId);
  if (!doc?.url) return res.status(404).json({ message: 'Document not found' });
  const filename = doc.name || doc.title || 'document.pdf';
  return sendPdfDownload(res, doc.url, filename, { inline: true });
});

router.post('/', protect, contentManagers, uploadDeskMedia, async (req, res) => {
  try {
    const {
      title,
      kicker,
      listingDescription,
      featureBlurb,
      fullHeader,
      fullBody,
      number,
      published,
      galleryCaptions,
      galleryAfterParagraphs,
      documentsMeta,
    } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const heroFile = req.files?.hero?.[0];
    if (heroFile && !isImage(heroFile)) {
      return res.status(400).json({ message: 'Hero must be an image (jpg, png, webp)' });
    }

    let heroImage = null;
    if (heroFile) heroImage = await uploadBuffer(heroFile, 'desk');
    const gallery = dedupeGalleryAgainstHero(
      await buildGallery(req.files?.gallery, galleryCaptions, galleryAfterParagraphs),
      heroImage,
    );
    const documents = await buildDocuments(
      req.files?.documents,
      documentsMeta,
      req.files?.documentCovers,
    );

    const count = await DeskStory.countDocuments();
    let storyNumber = count + 1;
    if (number !== undefined && number !== '') {
      const parsed = parseInt(number, 10);
      if (!Number.isNaN(parsed) && parsed > 0) storyNumber = parsed;
    }

    const story = await DeskStory.create({
      id: generateId('desk'),
      slug: slugify(title, { lower: true, strict: true }),
      number: storyNumber,
      kicker: kicker || 'Senior Citizens',
      title,
      listingDescription: listingDescription || '',
      featureBlurb: (featureBlurb || '').trim(),
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
      featureBlurb,
      fullHeader,
      fullBody,
      number,
      published,
      galleryCaptions,
      galleryAfterParagraphs,
      documentsMeta,
      galleryJson,
      documentsJson,
      clearHero,
    } = req.body;

    if (title) {
      story.title = title;
      story.slug = slugify(title, { lower: true, strict: true });
    }
    if (kicker !== undefined) story.kicker = kicker;
    if (listingDescription !== undefined) story.listingDescription = listingDescription;
    if (featureBlurb !== undefined) story.featureBlurb = String(featureBlurb).trim();
    if (fullHeader !== undefined) story.fullHeader = fullHeader;
    if (fullBody !== undefined) story.fullBody = fullBody;
    if (number !== undefined && number !== '') {
      const n = parseInt(number, 10);
      if (!Number.isNaN(n)) story.number = n;
    }
    if (published !== undefined) story.published = published === 'false' ? false : true;

    const keptGallery = parseJsonArray(galleryJson, 'galleryJson');
    if (!keptGallery.ok) return res.status(400).json({ message: keptGallery.error });
    if (keptGallery.value) {
      story.gallery = mapKeptGallery(keptGallery.value);
    }

    const keptDocs = parseJsonArray(documentsJson, 'documentsJson');
    if (!keptDocs.ok) return res.status(400).json({ message: keptDocs.error });
    if (keptDocs.value) {
      story.documents = mapKeptDocuments(keptDocs.value);
    }

    if (clearHero === 'true' || clearHero === true) {
      story.heroImage = null;
    }

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
      galleryAfterParagraphs,
      (story.gallery || []).length,
    );
    if (newGallery.length) story.gallery = [...(story.gallery || []), ...newGallery];

    const newDocs = await buildDocuments(
      req.files?.documents,
      documentsMeta,
      req.files?.documentCovers,
    );
    if (newDocs.length) story.documents = [...(story.documents || []), ...newDocs];

    story.gallery = dedupeGalleryAgainstHero(story.gallery, story.heroImage);

    story.updatedAt = new Date().toISOString();
    await story.save();
    res.json(story.toObject());
  } catch (err) {
    res.status(500).json({ message: err.message || 'Update failed' });
  }
});

/** Resequence project numbers 1..n (fixes leftovers like a lone “03”). */
router.post('/renumber', protect, contentManagers, async (_req, res) => {
  await renumberDeskStories();
  const items = await DeskStory.find({}).sort({ number: 1, createdAt: 1 }).lean();
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

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await DeskStory.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Desk story not found' });
  await renumberDeskStories();
  res.json({ message: 'Desk story deleted' });
});

module.exports = router;
