const express = require('express');
const { Report } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, superAdminOnly } = require('../auth');
const { uploadPDF } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');
const { createPdfDownloadHandler, assertPdfUpload } = require('../lib/pdfDownload');

const router = express.Router();

/**
 * Sort key from year strings like "2025–26", "2025-26", "2025".
 * Higher = more recent.
 */
function yearSortKey(year) {
  const m = String(year || '').match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : 0;
}

router.get('/', async (req, res) => {
  const all = await Report.find().lean();
  all.sort((a, b) => {
    const dy = yearSortKey(b.year) - yearSortKey(a.year);
    if (dy !== 0) return dy;
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });

  // Public UI: only the latest two years. Admin list: all.
  if (req.query.all === 'true') {
    return res.json(all);
  }
  res.json(all.slice(0, 2));
});

router.get(
  '/:id/download',
  createPdfDownloadHandler(Report, { titleField: 'year', notFound: 'Report not found' }),
);

router.post('/', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const { title, year, summary } = req.body;
  if (!year?.trim()) return res.status(400).json({ message: 'Year is required (e.g. 2025–26)' });
  const pdfErr = assertPdfUpload(req.file);
  if (pdfErr) return res.status(400).json({ message: pdfErr });

  const file = await uploadBuffer(req.file, 'reports');
  const report = await Report.create({
    id: generateId('report'),
    title: title?.trim() || `Annual Report ${year.trim()}`,
    year: year.trim(),
    summary: summary?.trim() || 'Impact, audited financials & ledger',
    file,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(report.toObject());
});

router.put('/:id', protect, contentManagers, uploadPDF.single('file'), async (req, res) => {
  const report = await Report.findOne({ id: req.params.id });
  if (!report) return res.status(404).json({ message: 'Report not found' });

  const { title, year, summary } = req.body;
  if (year?.trim()) report.year = year.trim();
  if (title !== undefined) {
    report.title = title?.trim() || `Annual Report ${report.year}`;
  }
  if (summary !== undefined) report.summary = summary?.trim() || report.summary;

  if (req.file) {
    const pdfErr = assertPdfUpload(req.file);
    if (pdfErr) return res.status(400).json({ message: pdfErr });
    report.file = await uploadBuffer(req.file, 'reports');
  }

  await report.save();
  res.json(report.toObject());
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const result = await Report.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Report not found' });
  res.json({ message: 'Report deleted' });
});

module.exports = router;
