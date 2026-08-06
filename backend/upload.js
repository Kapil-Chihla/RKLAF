const multer = require('multer');
const path = require('path');

const memory = multer.memoryStorage();

const fileFilter = (allowed) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`Only ${allowed.join(', ')} files allowed`), false);
};

exports.uploadImage = multer({
  storage: memory,
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.webp']),
  limits: { fileSize: 10 * 1024 * 1024 },
});

exports.uploadPDF = multer({
  storage: memory,
  fileFilter: fileFilter(['.pdf']),
  limits: { fileSize: 20 * 1024 * 1024 },
});

exports.uploadAny = multer({
  storage: memory,
  limits: { fileSize: 20 * 1024 * 1024 },
});
