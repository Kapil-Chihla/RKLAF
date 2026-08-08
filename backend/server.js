const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const { configureCloudinary } = require('./config/cloudinary');
const seedMapLocationsIfEmpty = require('./seed/mapLocations');
const seedGuideCategoriesIfEmpty = require('./seed/guideCategories');
const seedTestSuperAdmin = require('./seed/testSuperAdmin');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

function corsOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.vercel.app')) return true;
    if (host.endsWith('.netlify.app')) return true;
  } catch {
    /* ignore */
  }
  return false;
}

app.use(
  cors({
    origin: (origin, cb) => {
      cb(null, corsOriginAllowed(origin));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/invites', require('./routes/invites'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/guide-categories', require('./routes/guideCategories'));
app.use('/api/desk-stories', require('./routes/deskStories'));
app.use('/api/success-stories', require('./routes/successStories'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/explainer-videos', require('./routes/explainerVideos'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/team', require('./routes/team'));
app.use('/api/map-locations', require('./routes/mapLocations'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Server running' }));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : err.message });
  }
  if (err.message?.includes('files allowed')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

const uploadFolders = [
  'blogs',
  'articles',
  'reports',
  'team',
  'camps',
  'desk',
  'success',
  'papers',
  'videos',
  'general',
];
uploadFolders.forEach((folder) => {
  const fullPath = path.join(__dirname, 'uploads', folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const PORT = process.env.PORT || 5000;

async function start() {
  configureCloudinary();
  await connectDB();
  await seedMapLocationsIfEmpty();
  await seedGuideCategoriesIfEmpty();
  await seedTestSuperAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
