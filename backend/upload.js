const multer = require('multer');
const path = require('path');

const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, `uploads/${folder}`),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (allowed) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`Only ${allowed.join(', ')} files allowed`), false);
};

exports.uploadImage = (folder) => multer({
  storage: storage(folder),
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.webp']),
  limits: { fileSize: 5 * 1024 * 1024 }
});

exports.uploadPDF = (folder) => multer({
  storage: storage(folder),
  fileFilter: fileFilter(['.pdf']),
  limits: { fileSize: 20 * 1024 * 1024 }
});

exports.uploadAny = (folder) => multer({
  storage: storage(folder),
  limits: { fileSize: 20 * 1024 * 1024 }
});