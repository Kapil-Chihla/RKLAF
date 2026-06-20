const path = require('path');
const { cloudinary } = require('../config/cloudinary');

function resourceType(mimetype, ext) {
  if (mimetype === 'application/pdf' || ext === '.pdf') return 'raw';
  if (mimetype.startsWith('image/')) return 'image';
  return 'auto';
}

function uploadBuffer(file, folder) {
  const ext = path.extname(file.originalname).toLowerCase();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `rklaf/${folder}`,
        resource_type: resourceType(file.mimetype, ext),
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

module.exports = { uploadBuffer };
