const slugify = require('slugify');
const https = require('https');
const http = require('http');
const { cloudinaryPrivateDownloadUrl, parseCloudinaryUrl } = require('./cloudinaryUpload');

function pdfFilename(title, fallback = 'document') {
  const base = slugify(title || fallback, { lower: true, strict: true }) || fallback;
  return `${base}.pdf`;
}

function contentDisposition(filename) {
  const safe = String(filename || 'document.pdf')
    .replace(/[/\\?&#]+/g, '-')
    .replace(/"/g, '');
  const ascii = safe.replace(/[^\x20-\x7E]+/g, '_') || 'document.pdf';
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(safe)}`;
}

/**
 * Fetch Cloudinary private download URL and pipe bytes to the Express response.
 * Avoids browser landing on broken CDN fl_attachment URLs (HTTP 400 / ACL 401).
 */
function streamUrlToResponse(fileUrl, res, { filename, contentType = 'application/pdf' }) {
  return new Promise((resolve, reject) => {
    const lib = fileUrl.startsWith('https') ? https : http;
    const req = lib.get(fileUrl, (upstream) => {
      // Follow one redirect if Cloudinary issues one
      if (
        upstream.statusCode >= 300 &&
        upstream.statusCode < 400 &&
        upstream.headers.location
      ) {
        upstream.resume();
        return streamUrlToResponse(upstream.headers.location, res, { filename, contentType })
          .then(resolve)
          .catch(reject);
      }

      if (upstream.statusCode !== 200) {
        upstream.resume();
        return reject(new Error(`Upstream download failed (${upstream.statusCode})`));
      }

      if (typeof res.status === 'function') res.status(200);
      else res.statusCode = 200;
      res.setHeader('Content-Type', upstream.headers['content-type'] || contentType);
      res.setHeader('Content-Disposition', contentDisposition(filename));
      if (upstream.headers['content-length']) {
        res.setHeader('Content-Length', upstream.headers['content-length']);
      }
      res.setHeader('Cache-Control', 'private, no-store');
      upstream.pipe(res);
      upstream.on('end', resolve);
      upstream.on('error', reject);
    });
    req.on('error', reject);
  });
}

/**
 * Resolve a stored Cloudinary file URL into a download streamed through our API.
 */
async function sendPdfDownload(res, fileUrl, filename = 'document.pdf') {
  let name = String(filename || 'document.pdf').trim() || 'document.pdf';
  if (!name.toLowerCase().endsWith('.pdf')) name += '.pdf';

  const privateUrl = cloudinaryPrivateDownloadUrl(fileUrl, name);
  if (!privateUrl) {
    return res.status(500).json({ message: 'Could not build PDF download URL' });
  }

  try {
    await streamUrlToResponse(privateUrl, res, { filename: name });
  } catch (err) {
    if (!res.headersSent) {
      res.status(502).json({
        message: 'PDF download failed',
        detail: err.message,
        hint: parseCloudinaryUrl(fileUrl)
          ? 'Check Cloudinary credentials and that the file still exists'
          : 'Stored file URL is not a Cloudinary URL',
      });
    } else {
      res.destroy(err);
    }
  }
}

/**
 * Express handler factory: find doc by id/slug, stream PDF with attachment headers.
 */
function createPdfDownloadHandler(Model, { titleField = 'title', notFound = 'File not found' } = {}) {
  return async function pdfDownload(req, res) {
    try {
      const doc = await Model.findOne({
        $or: [{ id: req.params.id }, { slug: req.params.id }],
      }).lean();
      if (!doc) return res.status(404).json({ message: notFound });
      if (!doc.file) return res.status(404).json({ message: 'No PDF uploaded for this item' });

      const filename = pdfFilename(doc[titleField] || doc.year || 'document');
      return sendPdfDownload(res, doc.file, filename);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ message: err.message || 'Download failed' });
      }
    }
  };
}

function assertPdfUpload(file) {
  if (!file) return 'PDF file is required';
  const name = (file.originalname || '').toLowerCase();
  const ok = file.mimetype === 'application/pdf' || name.endsWith('.pdf');
  if (!ok) return 'The file must be a PDF (.pdf)';
  return null;
}

module.exports = {
  pdfFilename,
  createPdfDownloadHandler,
  assertPdfUpload,
  sendPdfDownload,
};
