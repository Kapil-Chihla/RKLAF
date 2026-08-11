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

const uploadToldDocs = uploadAny.fields([{ name: 'documents', maxCount: 12 }]);

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
  const urls = await Promise.all(pdfs.map((f) => uploadBuffer(f, 'told-in-full-docs')));
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
    createdAt: doc.createdAt || new Date().toISOString(),
  }));
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
  }).lean();
  if (!item) return res.status(404).json({ message: 'Told in full story not found' });
  res.json(item);
});

router.post('/', protect, contentManagers, uploadToldDocs, async (req, res) => {
  try {
    const { title, tag, caption, problem, action, result, sortOrder, published, documentsMeta } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

    const documents = await buildDocuments(req.files?.documents, documentsMeta);

    const item = await ToldInFull.create({
      id: generateId('told'),
      slug: slugify(title.trim(), { lower: true, strict: true }),
      tag: tag || '',
      title: title.trim(),
      caption: caption || '',
      problem: problem || '',
      action: action || '',
      result: result || '',
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

    const { title, tag, caption, problem, action, result, sortOrder, published, documentsMeta, documentsJson } =
      req.body;

    if (title?.trim()) {
      item.title = title.trim();
      item.slug = slugify(title.trim(), { lower: true, strict: true });
    }
    if (tag !== undefined) item.tag = tag;
    if (caption !== undefined) item.caption = caption;
    if (problem !== undefined) item.problem = problem;
    if (action !== undefined) item.action = action;
    if (result !== undefined) item.result = result;
    if (sortOrder !== undefined) item.sortOrder = Number(sortOrder) || 0;
    if (published !== undefined) item.published = published === 'false' || published === false ? false : true;

    if (documentsJson !== undefined) {
      const parsed = parseJsonArray(documentsJson, 'documentsJson');
      if (!parsed.ok) return res.status(400).json({ message: parsed.error });
      item.documents = mapKeptDocuments(parsed.value || []);
    }

    const added = await buildDocuments(req.files?.documents, documentsMeta);
    if (added.length) item.documents = [...(item.documents || []), ...added];

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
