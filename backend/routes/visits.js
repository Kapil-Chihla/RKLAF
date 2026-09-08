const express = require('express');
const rateLimit = require('express-rate-limit');
const { SiteStat } = require('../models');

const router = express.Router();

const hitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many visit increments from this IP' },
});

async function getVisitsDoc() {
  let doc = await SiteStat.findOne({ key: 'visits' });
  if (!doc) {
    doc = await SiteStat.create({ key: 'visits', count: 0 });
  }
  return doc;
}

router.get('/', async (_req, res) => {
  try {
    const doc = await getVisitsDoc();
    res.json({ visits: doc.count });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not load visit count' });
  }
});

/** Increment once per client session (frontend gates with sessionStorage). */
router.post('/hit', hitLimiter, async (_req, res) => {
  try {
    const doc = await SiteStat.findOneAndUpdate(
      { key: 'visits' },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ visits: doc.count });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not record visit' });
  }
});

module.exports = router;
