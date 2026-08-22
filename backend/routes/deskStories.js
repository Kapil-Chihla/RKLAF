const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { DeskStory } = require('../models');
const generateId = require('../lib/generateId');
const { parseJsonArray } = require('../lib/contentHelpers');
const {
  normalizeBlocks,
  legacyFromBlocks,
  blocksFromLegacy,
  normalizeUrl,
} = require('../lib/deskBodyBlocks');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { sendPdfDownload } = require('../lib/pdfDownload');

const router = express.Router();

const uploadDeskMedia = uploadAny.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'blockImages', maxCount: 24 },
  { name: 'documents', maxCount: 12 },
]);

function isImage(file) {
  return file?.mimetype?.startsWith('image/');
}

function isPdf(file) {
  const ext = path.extname(file?.originalname || '').toLowerCase();
  return file?.mimetype === 'application/pdf' || ext === '.pdf';
}

async function buildDocuments(files, metaRaw) {
  if (!files?.length) return [];
  const pdfs = files.filter(isPdf);
  if (!pdfs.length) return [];
  const metaParsed = parseJsonArray(metaRaw, 'documentsMeta');
  const meta = metaParsed.ok && metaParsed.value ? metaParsed.value : [];

  const urls = await Promise.all(pdfs.map((f) => uploadBuffer(f, 'desk-docs')));
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
      coverImage: null,
      createdAt: now,
    };
  });
}

function mapKeptDocuments(items) {
  return (items || []).map((doc) => ({
    id: doc.id || generateId('doc'),
    url: doc.url,
    name: doc.name || 'document.pdf',
    title: String(doc.title || '').trim(),
    description: String(doc.description || '').trim(),
    coverImage: null,
    createdAt: doc.createdAt || new Date().toISOString(),
  }));
}

/**
 * Resolve bodyBlocks from multipart: upload new blockImages in order for isNew slots.
 * Syncs fullBody + gallery. Strips images that match hero URL.
 */
async function applyBodyBlocks(storyLike, bodyBlocksRaw, blockImageFiles, heroImage) {
  const parsed = parseJsonArray(bodyBlocksRaw, 'bodyBlocks');
  if (!parsed.ok) return { ok: false, error: parsed.error };
  if (!parsed.value) return { ok: true, skipped: true };

  const draft = normalizeBlocks(parsed.value);
  const files = (blockImageFiles || []).filter(isImage);
  let fileIdx = 0;
  const hero = normalizeUrl(heroImage);
  const resolved = [];

  for (const block of draft) {
    if (block.type === 'paragraph') {
      resolved.push({ type: 'paragraph', text: block.text });
      continue;
    }
    let url = block.url;
    let id = block.id || generateId('img');
    if (block.isNew) {
      const file = files[fileIdx++];
      if (!file) {
        return { ok: false, error: 'Missing image file for a new photo block' };
      }
      url = await uploadBuffer(file, 'desk');
      id = generateId('img');
    }
    if (!url) continue;
    if (normalizeUrl(url) === hero) continue;
    resolved.push({
      type: 'image',
      id,
      url,
      caption: block.caption || '',
    });
  }

  if (fileIdx < files.length) {
    return { ok: false, error: 'Extra image files were uploaded without matching blocks' };
  }

  const legacy = legacyFromBlocks(resolved);
  return {
    ok: true,
    bodyBlocks: resolved,
    fullBody: legacy.fullBody,
    gallery: legacy.gallery,
  };
}

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

function withResolvedBlocks(item) {
  if (!item) return item;
  const documents = (item.documents || []).map((doc) => ({ ...doc, coverImage: null }));
  if (Array.isArray(item.bodyBlocks) && item.bodyBlocks.length) {
    return { ...item, documents };
  }
  return {
    ...item,
    documents,
    bodyBlocks: blocksFromLegacy(item.fullBody, item.gallery, item.heroImage),
  };
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const items = await DeskStory.find(filter).sort({ createdAt: -1, number: -1 }).lean();
  res.json(items.map(withResolvedBlocks));
});

router.get('/:slugOrId/documents/:docId/download', async (req, res) => {
  const { slugOrId, docId } = req.params;
  const story = await DeskStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!story) return res.status(404).json({ message: 'Programme not found' });
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
  if (!story) return res.status(404).json({ message: 'Programme not found' });
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
      number,
      published,
      documentsMeta,
      bodyBlocks,
    } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const heroFile = req.files?.hero?.[0];
    if (heroFile && !isImage(heroFile)) {
      return res.status(400).json({ message: 'Hero must be an image (jpg, png, webp)' });
    }

    let heroImage = null;
    if (heroFile) heroImage = await uploadBuffer(heroFile, 'desk');

    const blocksResult = await applyBodyBlocks(
      {},
      bodyBlocks,
      req.files?.blockImages,
      heroImage,
    );
    if (!blocksResult.ok) return res.status(400).json({ message: blocksResult.error });

    const documents = await buildDocuments(req.files?.documents, documentsMeta);

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
      fullBody: blocksResult.skipped ? '' : blocksResult.fullBody,
      bodyBlocks: blocksResult.skipped ? [] : blocksResult.bodyBlocks,
      gallery: blocksResult.skipped ? [] : blocksResult.gallery,
      documents,
      published: published === 'false' ? false : true,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(withResolvedBlocks(story.toObject()));
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

router.put('/:id', protect, contentManagers, uploadDeskMedia, async (req, res) => {
  try {
    const story = await DeskStory.findOne({ id: req.params.id });
    if (!story) return res.status(404).json({ message: 'Programme not found' });

    const {
      title,
      kicker,
      listingDescription,
      featureBlurb,
      fullHeader,
      number,
      published,
      documentsMeta,
      documentsJson,
      bodyBlocks,
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
    if (number !== undefined && number !== '') {
      const n = parseInt(number, 10);
      if (!Number.isNaN(n)) story.number = n;
    }
    if (published !== undefined) story.published = published === 'false' ? false : true;

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

    const blocksResult = await applyBodyBlocks(
      story,
      bodyBlocks,
      req.files?.blockImages,
      story.heroImage,
    );
    if (!blocksResult.ok) return res.status(400).json({ message: blocksResult.error });
    if (!blocksResult.skipped) {
      story.bodyBlocks = blocksResult.bodyBlocks;
      story.fullBody = blocksResult.fullBody;
      story.gallery = blocksResult.gallery;
    }

    const newDocs = await buildDocuments(req.files?.documents, documentsMeta);
    if (newDocs.length) story.documents = [...(story.documents || []), ...newDocs];

    story.updatedAt = new Date().toISOString();
    await story.save();
    res.json(withResolvedBlocks(story.toObject()));
  } catch (err) {
    res.status(500).json({ message: err.message || 'Update failed' });
  }
});

router.post('/renumber', protect, contentManagers, async (_req, res) => {
  await renumberDeskStories();
  const items = await DeskStory.find({}).sort({ number: 1, createdAt: 1 }).lean();
  res.json(items.map(withResolvedBlocks));
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await DeskStory.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!item) return res.status(404).json({ message: 'Programme not found' });
  res.json(withResolvedBlocks(item));
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await DeskStory.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Programme not found' });
  await renumberDeskStories();
  res.json({ message: 'Programme deleted' });
});

module.exports = router;
