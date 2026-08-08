const path = require('path');
const { cloudinary } = require('../config/cloudinary');

function resourceType(mimetype, ext) {
  if (mimetype === 'application/pdf' || ext === '.pdf') return 'raw';
  if (mimetype?.startsWith('image/')) return 'image';
  if (
    mimetype?.startsWith('video/') ||
    mimetype?.startsWith('audio/') ||
    ['.mp4', '.webm', '.mov', '.m4v', '.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac'].includes(ext)
  ) {
    /* Cloudinary stores audio under the video resource type */
    return 'video';
  }
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
      // Prefer public delivery when the account allows PDF/ZIP delivery
      access_mode: 'public',
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
 * Parse Cloudinary delivery URL → { resourceType, type, publicId }.
 * Handles transforms + version segments before the public_id.
 */
function parseCloudinaryUrl(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return null;
  const full = fileUrl.match(
    /\/(raw|image|video|auto)\/(upload|authenticated|private)\/(?:(?:[^/]+\/)*?)?(?:v\d+\/)?(.+)$/i,
  );
  if (!full) return null;
  const publicId = decodeURIComponent(full[3].split('?')[0]).replace(/^\/+/, '');
  if (!publicId) return null;
  return {
    resourceType: full[1].toLowerCase(),
    type: full[2].toLowerCase(),
    publicId,
  };
}

/**
 * Signed Admin download URL. Works even when Free-plan CDN blocks PDF delivery
 * (x-cld-error: deny or ACL failure on /raw/upload/... PDFs).
 *
 * @param {string} fileUrl - stored Cloudinary secure_url
 * @param {string} [filename] - suggested download filename (e.g. report.pdf)
 * @param {number} [ttlSec=600]
 */
function cloudinaryPrivateDownloadUrl(fileUrl, filename = 'document.pdf', ttlSec = 600) {
  const parsed = parseCloudinaryUrl(fileUrl);
  if (!parsed) return null;

  let name = String(filename || 'document.pdf').trim() || 'document.pdf';
  if (!name.toLowerCase().endsWith('.pdf')) name += '.pdf';
  name = name.replace(/[/\\?&#]+/g, '-').slice(0, 120);

  return cloudinary.utils.private_download_url(parsed.publicId, '', {
    resource_type: parsed.resourceType,
    type: parsed.type === 'authenticated' ? 'authenticated' : 'upload',
    attachment: name,
    expires_at: Math.floor(Date.now() / 1000) + ttlSec,
  });
}

/**
 * Legacy CDN fl_attachment helper.
 * Free Cloudinary plans often block PDF CDN delivery — prefer privateDownloadUrl.
 * Do NOT put a `.pdf` (or `%2Epdf`) in the flag value: Cloudinary still splits on
 * the decoded dot and returns "Invalid flag in transformation: pdf".
 */
function cloudinaryAttachmentUrl(fileUrl, filename = 'document.pdf') {
  if (!fileUrl) return null;
  // Prefer signed Admin download whenever credentials are configured
  try {
    const privateUrl = cloudinaryPrivateDownloadUrl(fileUrl, filename);
    if (privateUrl) return privateUrl;
  } catch (_) {
    /* fall through to CDN flag */
  }

  if (/\/upload\/fl_attachment/.test(fileUrl)) return fileUrl;
  if (fileUrl.includes('/upload/')) {
    return fileUrl.replace('/upload/', '/upload/fl_attachment/');
  }
  return fileUrl;
}

module.exports = {
  uploadBuffer,
  parseCloudinaryUrl,
  cloudinaryPrivateDownloadUrl,
  cloudinaryAttachmentUrl,
};
