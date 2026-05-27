const express = require('express');
const store = require('../dataStore');
const { persist } = require('../dataStore');
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

router.get('/', (req, res) => {
  const activeOnly = req.query.active !== 'false';
  let list = store.mapLocations || [];
  if (activeOnly) list = list.filter((l) => l.active !== false);
  res.json(list);
});

router.get('/filters', (req, res) => {
  const list = (store.mapLocations || []).filter((l) => l.active !== false);
  const uniq = (key) => [...new Set(list.map((l) => l[key]).filter(Boolean))].sort();
  res.json({
    regions: uniq('region'),
    countries: uniq('country'),
    workTypes: uniq('workType'),
  });
});

router.post('/', protect, contentManagers, (req, res) => {
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

  const location = {
    id: `map-${Date.now()}`,
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
  };

  if (!store.mapLocations) store.mapLocations = [];
  store.mapLocations.unshift(location);
  persist();
  res.status(201).json(location);
});

router.put('/:id', protect, contentManagers, (req, res) => {
  const idx = (store.mapLocations || []).findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Location not found' });

  const current = store.mapLocations[idx];
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

  store.mapLocations[idx] = {
    ...current,
    name: body.name ?? current.name,
    country: body.country ?? current.country,
    region: body.region ?? current.region,
    workType: body.workType ?? current.workType,
    lat,
    lng,
    mapX,
    mapY,
    summary: body.summary ?? current.summary,
    workItems: body.workItems != null ? parseWorkItems(body.workItems) : current.workItems,
    overviewUrl: body.overviewUrl ?? current.overviewUrl,
    active: body.active != null ? body.active !== false : current.active,
    updatedAt: new Date().toISOString(),
  };

  persist();
  res.json(store.mapLocations[idx]);
});

router.delete('/:id', protect, adminOrSuper, (req, res) => {
  const idx = (store.mapLocations || []).findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Location not found' });
  store.mapLocations.splice(idx, 1);
  persist();
  res.json({ message: 'Location removed' });
});

module.exports = router;
