const path = require('path');
const { cloudinary } = require('../config/cloudinary');

function resourceType(mimetype, ext) {
  if (mimetype === 'application/pdf' || ext === '.pdf') return 'raw';
  if (mimetype?.startsWith('image/')) return 'image';
  return 'auto';
}

function safeBaseName(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const base = path.basename(originalname, ext) || 'document';
  return base.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').slice(0, 80) || 'document';
}

/**
 * Upload a buffer to Cloudinary.
 * PDFs are stored as raw with a .pdf public_id so browsers treat them as PDFs.
 */
function uploadBuffer(file, folder) {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdf = file.mimetype === 'application/pdf' || ext === '.pdf';
  const type = resourceType(file.mimetype, ext);

  return new Promise((resolve, reject) => {
    const options = {
      folder: `rklaf/${folder}`,
      resource_type: type,
      use_filename: !isPdf,
      unique_filename: true,
    };

    if (isPdf) {
      // Extension in public_id is important for raw PDF Content-Type
      options.public_id = `${safeBaseName(file.originalname)}.pdf`;
      options.use_filename = false;
    }

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
}

/**
 * Turn a Cloudinary delivery URL into a forced-download URL with a .pdf filename.
 * Cross-origin HTML `download` attributes are ignored by browsers — this is required.
 */
function cloudinaryAttachmentUrl(fileUrl, filename = 'document.pdf') {
  if (!fileUrl) return null;
  let name = String(filename).trim() || 'document.pdf';
  if (!name.toLowerCase().endsWith('.pdf')) name += '.pdf';
  // Cloudinary fl_attachment value: keep it URL-safe
  const safe = encodeURIComponent(name.replace(/[/\\?&#]+/g, '-'));

  if (fileUrl.includes('/upload/')) {
    return fileUrl.replace('/upload/', `/upload/fl_attachment:${safe}/`);
  }
  return fileUrl;
}

module.exports = { uploadBuffer, cloudinaryAttachmentUrl };
