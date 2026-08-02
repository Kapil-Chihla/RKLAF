const slugify = require('slugify');
const { cloudinaryAttachmentUrl } = require('./cloudinaryUpload');

function pdfFilename(title, fallback = 'document') {
  const base = slugify(title || fallback, { lower: true, strict: true }) || fallback;
  return `${base}.pdf`;
}

/**
 * Express handler factory: find doc by id/slug, redirect to Cloudinary fl_attachment PDF URL.
 */
function createPdfDownloadHandler(Model, { titleField = 'title', notFound = 'File not found' } = {}) {
  return async function pdfDownload(req, res) {
    const doc = await Model.findOne({
      $or: [{ id: req.params.id }, { slug: req.params.id }],
    }).lean();
    if (!doc) return res.status(404).json({ message: notFound });
    if (!doc.file) return res.status(404).json({ message: 'No PDF uploaded for this item' });

    const filename = pdfFilename(doc[titleField] || doc.year || 'document');
    const url = cloudinaryAttachmentUrl(doc.file, filename);
    return res.redirect(302, url);
  };
}

function assertPdfUpload(file) {
  if (!file) return 'PDF file is required';
  const name = (file.originalname || '').toLowerCase();
  const ok =
    file.mimetype === 'application/pdf' ||
    name.endsWith('.pdf');
  if (!ok) return 'The file must be a PDF (.pdf)';
  return null;
}

module.exports = {
  pdfFilename,
  createPdfDownloadHandler,
  assertPdfUpload,
};
