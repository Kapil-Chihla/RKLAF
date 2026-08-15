const express = require('express');
const path = require('path');
const slugify = require('slugify');
const { ToldInFull } = require('../models');
const generateId = require('../lib/generateId');
const { parseJsonArray } = require('../lib/contentHelpers');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { uploadAny } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { sendPdfDownload } = require('../lib/pdfDownload');

const router = express.Router();

const uploadToldDocs = uploadAny.fields([
  { name: 'documents', maxCount: 12 },
  { name: 'documentCovers', maxCount: 12 },
  { name: 'coverReplacements', maxCount: 12 },
]);

function isPdf(file) {
  const ext = path.extname(file?.originalname || '').toLowerCase();
  return file?.mimetype === 'application/pdf' || ext === '.pdf';
}

function isImage(file) {
  return file?.mimetype?.startsWith('image/');
}

async function buildDocuments(files, metaRaw, coverFiles, coverIndexesRaw) {
  if (!files?.length) return [];
  const pdfs = files.filter(isPdf);
  if (!pdfs.length) return [];
  const metaParsed = parseJsonArray(metaRaw, 'documentsMeta');
  const meta = metaParsed.ok && metaParsed.value ? metaParsed.value : [];
  const covers = (coverFiles || []).filter(isImage);
  const indexParsed = parseJsonArray(coverIndexesRaw, 'documentCoverIndexes');
  const coverIndexes =
    indexParsed.ok && Array.isArray(indexParsed.value) ? indexParsed.value.map(Number) : [];

  const coverByPdfIndex = new Map();
  if (coverIndexes.length) {
    covers.forEach((file, i) => {
      const pdfIndex = coverIndexes[i];
      if (Number.isFinite(pdfIndex)) coverByPdfIndex.set(pdfIndex, file);
    });
  } else {
    covers.forEach((file, i) => coverByPdfIndex.set(i, file));
  }

  const urls = await Promise.all(pdfs.map((f) => uploadBuffer(f, 'told-in-full-docs')));
  const coverUrls = await Promise.all(
    pdfs.map((_, index) => {
      const cover = coverByPdfIndex.get(index);
      return cover ? uploadBuffer(cover, 'told-in-full-docs') : Promise.resolve(null);
    }),
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

function mapKeptDocuments(items) {
  return (items || []).map((doc) => ({
    id: doc.id || generateId('doc'),
    url: doc.url,
    name: doc.name || 'document.pdf',
    title: String(doc.title || '').trim() || String(doc.name || '').replace(/\.pdf$/i, ''),
    description: String(doc.description || '').trim(),
    coverImage: doc.coverImage || null,
    createdAt: doc.createdAt || new Date().toISOString(),
  }));
}

/** Replace preview images on existing docs (paired by coverReplaceIds order). */
async function applyCoverReplacements(docs, files, idsRaw) {
  const parsed = parseJsonArray(idsRaw, 'coverReplaceIds');
  if (!parsed.ok) return { ok: false, error: parsed.error };
  const ids = parsed.value || [];
  const images = (files || []).filter(isImage);
  if (!ids.length || !images.length) return { ok: true, docs };

  const next = [...docs];
  const count = Math.min(ids.length, images.length);
  for (let i = 0; i < count; i += 1) {
    const docId = String(ids[i] || '');
    const idx = next.findIndex((d) => d.id === docId);
    if (idx === -1) continue;
    const url = await uploadBuffer(images[i], 'told-in-full-docs');
    next[idx] = { ...next[idx], coverImage: url };
  }
  return { ok: true, docs: next };
}

function publicFilter(req) {
  return req.query.all === 'true' ? {} : { published: { $ne: false } };
}

router.get('/', async (req, res) => {
  const items = await ToldInFull.find(publicFilter(req)).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:slugOrId/documents/:docId/download', async (req, res) => {
  const { slugOrId, docId } = req.params;
  const story = await ToldInFull.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...publicFilter(req),
  }).lean();
  if (!story) return res.status(404).json({ message: 'Told in full story not found' });
  const doc = (story.documents || []).find((d) => d.id === docId);
  if (!doc?.url) return res.status(404).json({ message: 'Document not found' });
  return sendPdfDownload(res, doc.url, doc.name || doc.title || 'document.pdf');
});

router.get('/:slugOrId/documents/:docId/view', async (req, res) => {
  const { slugOrId, docId } = req.params;
  const story = await ToldInFull.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...publicFilter(req),
  }).lean();
  if (!story) return res.status(404).json({ message: 'Told in full story not found' });
  const doc = (story.documents || []).find((d) => d.id === docId);
  if (!doc?.url) return res.status(404).json({ message: 'Document not found' });
  return sendPdfDownload(res, doc.url, doc.name || doc.title || 'document.pdf', { inline: true });
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const item = await ToldInFull.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...publicFilter(req),
  }).lean();
  if (!item) return res.status(404).json({ message: 'Told in full story not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadToldDocs, async (req, res) => {
  try {
    const { title, tag, caption, caseLine, problem, action, result, fullBody, sortOrder, published, documentsMeta, documentCoverIndexes } =
      req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

    const documents = await buildDocuments(
      req.files?.documents,
      documentsMeta,
      req.files?.documentCovers,
      documentCoverIndexes,
    );

    const item = await ToldInFull.create({
      id: generateId('told'),
      slug: slugify(title.trim(), { lower: true, strict: true }),
      tag: tag || '',
      title: title.trim(),
      caption: caption || '',
      caseLine: caseLine || '',
      problem: problem || '',
      action: action || '',
      result: result || '',
      fullBody: fullBody || '',
      documents,
      sortOrder: Number(sortOrder) || 0,
      published: published === 'false' || published === false ? false : true,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(item.toObject());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to create told in full story' });
  }
});

router.put('/:id', protect, contentManagers, uploadToldDocs, async (req, res) => {
  try {
    const item = await ToldInFull.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Told in full story not found' });

    const {
      title,
      tag,
      caption,
      caseLine,
      problem,
      action,
      result,
      fullBody,
      sortOrder,
      published,
      documentsMeta,
      documentsJson,
      coverReplaceIds,
    } = req.body;

    if (title?.trim()) {
      item.title = title.trim();
      item.slug = slugify(title.trim(), { lower: true, strict: true });
    }
    if (tag !== undefined) item.tag = tag;
    if (caption !== undefined) item.caption = caption;
    if (caseLine !== undefined) item.caseLine = caseLine;
    if (problem !== undefined) item.problem = problem;
    if (action !== undefined) item.action = action;
    if (result !== undefined) item.result = result;
    if (fullBody !== undefined) item.fullBody = fullBody;
    if (sortOrder !== undefined) item.sortOrder = Number(sortOrder) || 0;
    if (published !== undefined) item.published = published === 'false' || published === false ? false : true;

    let docs = item.documents || [];
    if (documentsJson !== undefined) {
      const parsed = parseJsonArray(documentsJson, 'documentsJson');
      if (!parsed.ok) return res.status(400).json({ message: parsed.error });
      docs = mapKeptDocuments(parsed.value || []);
    }

    const replaced = await applyCoverReplacements(
      docs,
      req.files?.coverReplacements,
      coverReplaceIds,
    );
    if (!replaced.ok) return res.status(400).json({ message: replaced.error });
    docs = replaced.docs;

    const added = await buildDocuments(
      req.files?.documents,
      documentsMeta,
      req.files?.documentCovers,
      req.body.documentCoverIndexes,
    );
    if (added.length) docs = [...docs, ...added];

    item.documents = docs;
    item.updatedAt = new Date().toISOString();
    await item.save();
    const out = item.toObject();
    delete out.heroImage;
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to update told in full story' });
  }
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await ToldInFull.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Told in full story not found' });
  res.json({ message: 'Told in full story deleted' });
});

module.exports = router;
