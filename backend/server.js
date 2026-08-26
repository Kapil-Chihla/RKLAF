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
const seedGuideCategoriesIfEmpty = require('./seed/guideCategories');
const seedTestSuperAdmin = require('./seed/testSuperAdmin');

const app = express();

// Render (and other reverse proxies) set X-Forwarded-For; required by express-rate-limit
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://radheykrishnafoundation.org',
  'https://www.radheykrishnafoundation.org',
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 600 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  skip: (req) => req.path === '/health' || req.path === '/api/health',
});
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
app.use('/api/running-now', require('./routes/runningNow'));
app.use('/api/told-in-full', require('./routes/toldInFull'));
app.use('/api/also-on-record', require('./routes/alsoOnRecord'));
app.use('/api/press-mentions', require('./routes/pressMentions'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/explainer-videos', require('./routes/explainerVideos'));
app.use('/api/rights-decks', require('./routes/rightsDecks'));
app.use('/api/library-podcasts', require('./routes/libraryPodcasts'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/team', require('./routes/team'));

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
  await seedGuideCategoriesIfEmpty();
  await seedTestSuperAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
