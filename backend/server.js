const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const seedMapLocationsIfEmpty = require('./seed/mapLocations');

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
app.use('/api/reports', require('./routes/reports'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/team', require('./routes/team'));
app.use('/api/map-locations', require('./routes/mapLocations'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Server running' }));

const uploadFolders = ['blogs', 'articles', 'reports', 'team', 'general'];
uploadFolders.forEach((folder) => {
  const fullPath = path.join(__dirname, 'uploads', folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await seedMapLocationsIfEmpty();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
