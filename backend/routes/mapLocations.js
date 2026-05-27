const express = require('express');
const { MapLocation } = require('../models');
const generateId = require('../lib/generateId');
const { protect, contentManagers, adminOrSuper } = require('../auth');
const { latLngToMapPercent } = require('../utils/geo');

const router = express.Router();

function parseWorkItems(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

router.get('/', async (req, res) => {
  const activeOnly = req.query.active !== 'false';
  const filter = activeOnly ? { active: { $ne: false } } : {};
  const list = await MapLocation.find(filter).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.get('/filters', async (req, res) => {
  const list = await MapLocation.find({ active: { $ne: false } }).lean();
  const uniq = (key) => [...new Set(list.map((l) => l[key]).filter(Boolean))].sort();
  res.json({
    regions: uniq('region'),
    countries: uniq('country'),
    workTypes: uniq('workType'),
  });
});

router.post('/', protect, contentManagers, async (req, res) => {
  const {
    name,
    country,
    region,
    workType,
    lat,
    lng,
    mapX,
    mapY,
    summary,
    workItems,
    overviewUrl,
    active,
  } = req.body;

  if (!name) return res.status(400).json({ message: 'Location name is required' });

  let coords = { mapX: Number(mapX), mapY: Number(mapY) };
  if (lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
    coords = latLngToMapPercent(lat, lng);
  }
  if (Number.isNaN(coords.mapX) || Number.isNaN(coords.mapY)) {
    return res.status(400).json({ message: 'Provide latitude/longitude or map X/Y (0–100)' });
  }

  const location = await MapLocation.create({
    id: generateId('map'),
    name,
    country: country || '',
    region: region || '',
    workType: workType || '',
    lat: lat != null ? Number(lat) : null,
    lng: lng != null ? Number(lng) : null,
    mapX: coords.mapX,
    mapY: coords.mapY,
    summary: summary || '',
    workItems: parseWorkItems(workItems),
    overviewUrl: overviewUrl || '/our-work/impact',
    active: active !== false,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(location.toObject());
});

router.put('/:id', protect, contentManagers, async (req, res) => {
  const current = await MapLocation.findOne({ id: req.params.id });
  if (!current) return res.status(404).json({ message: 'Location not found' });

  const body = req.body;
  let mapX = body.mapX != null ? Number(body.mapX) : current.mapX;
  let mapY = body.mapY != null ? Number(body.mapY) : current.mapY;
  const lat = body.lat != null ? Number(body.lat) : current.lat;
  const lng = body.lng != null ? Number(body.lng) : current.lng;

  if (body.lat != null && body.lng != null) {
    const coords = latLngToMapPercent(lat, lng);
    mapX = coords.mapX;
    mapY = coords.mapY;
  }

  current.name = body.name ?? current.name;
  current.country = body.country ?? current.country;
  current.region = body.region ?? current.region;
  current.workType = body.workType ?? current.workType;
  current.lat = lat;
  current.lng = lng;
  current.mapX = mapX;
  current.mapY = mapY;
  current.summary = body.summary ?? current.summary;
  current.workItems = body.workItems != null ? parseWorkItems(body.workItems) : current.workItems;
  current.overviewUrl = body.overviewUrl ?? current.overviewUrl;
  current.active = body.active != null ? body.active !== false : current.active;
  current.updatedAt = new Date().toISOString();

  await current.save();
  res.json(current.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await MapLocation.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Location not found' });
  res.json({ message: 'Location removed' });
});

module.exports = router;
