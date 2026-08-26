const express = require('express');
const slugify = require('slugify');
const { Camp } = require('../models');
const generateId = require('../lib/generateId');
const normalizeCamp = require('../lib/normalizeCamp');
const { protect, contentManagers, superAdminOnly } = require('../auth');
const { uploadImage } = require('../upload');
const { uploadBuffer } = require('../lib/cloudinaryUpload');

const router = express.Router();

const uploadCampMedia = uploadImage.fields([
  { name: 'hero', maxCount: 1 },
  { name: 'images', maxCount: 24 },
]);

function parseTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    /* fall through */
  }
  return String(raw)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

async function uploadCampImages(files) {
  if (!files?.length) return [];
  const urls = await Promise.all(files.map((file) => uploadBuffer(file, 'camps')));
  return urls.map((url, index) => ({
    id: generateId('img'),
    url,
    caption: '',
    order: index,
  }));
}

function setHeroImage(camp, url) {
  if (!url) return;
  camp.heroImage = url;
  camp.coverImage = url;
}

async function applyHeroImage(camp, { heroImage, coverImage, heroIndex, coverIndex }, heroFile, newImages = []) {
  if (heroFile) {
    const url = await uploadBuffer(heroFile, 'camps');
    setHeroImage(camp, url);
    return;
  }

  const explicitHero = heroImage || coverImage;
  if (explicitHero) {
    setHeroImage(camp, explicitHero);
    return;
  }

  const pickerIndex = heroIndex ?? coverIndex;
  if (newImages.length && pickerIndex !== undefined && pickerIndex !== '') {
    const newIdx = parseInt(pickerIndex, 10);
    if (!Number.isNaN(newIdx) && newImages[newIdx]) {
      setHeroImage(camp, newImages[newIdx].url);
      return;
    }
  }

  const idx = parseInt(pickerIndex, 10);
  if (!Number.isNaN(idx) && camp.images?.[idx]) {
    setHeroImage(camp, camp.images[idx].url);
    return;
  }

  if (!camp.heroImage && camp.images?.length) {
    setHeroImage(camp, camp.images[0].url);
  }
}

router.get('/', async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { published: { $ne: false } };
  const camps = await Camp.find(filter).sort({ date: -1, createdAt: -1 }).lean();
  res.json(camps.map(normalizeCamp));
});

router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const camp = await Camp.findOne({
    $or: [{ slug: slugOrId }, { id: slugOrId }],
    ...(req.query.all === 'true' ? {} : { published: { $ne: false } }),
  }).lean();
  if (!camp) return res.status(404).json({ message: 'Camp not found' });
  res.json(normalizeCamp(camp));
});

router.post('/', protect, contentManagers, uploadCampMedia, async (req, res) => {
  const { title, location, date, summary, description, tags, heroImage, coverImage, heroIndex, coverIndex } = req.body;
  const imageFiles = req.files?.images || [];

  if (!title) return res.status(400).json({ message: 'Camp title is required' });
  if (!imageFiles.length && !req.files?.hero?.[0]) {
    return res.status(400).json({ message: 'Add album photos and/or a hero image' });
  }

  const images = await uploadCampImages(imageFiles);
  const camp = new Camp({
    id: generateId('camp'),
    slug: slugify(title, { lower: true, strict: true }),
    title,
    location: location || '',
    date: date || '',
    summary: summary || '',
    description: description || '',
    images,
    tags: parseTags(tags),
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await applyHeroImage(
    camp,
    { heroImage, coverImage, heroIndex, coverIndex },
    req.files?.hero?.[0],
    images,
  );

  await camp.save();
  res.status(201).json(normalizeCamp(camp.toObject()));
});

router.put('/:id', protect, contentManagers, uploadCampMedia, async (req, res) => {
  const camp = await Camp.findOne({ id: req.params.id });
  if (!camp) return res.status(404).json({ message: 'Camp not found' });

  const {
    title,
    location,
    date,
    summary,
    description,
    tags,
    heroImage,
    coverImage,
    heroIndex,
    coverIndex,
    imagesJson,
  } = req.body;

  if (title) {
    camp.title = title;
    camp.slug = slugify(title, { lower: true, strict: true });
  }
  if (location !== undefined) camp.location = location;
  if (date !== undefined) camp.date = date;
  if (summary !== undefined) camp.summary = summary;
  if (description !== undefined) camp.description = description;
  if (tags !== undefined) camp.tags = parseTags(tags);

  if (imagesJson) {
    try {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed)) camp.images = parsed;
    } catch {
      return res.status(400).json({ message: 'Invalid images data' });
    }
  }

  const newImages = await uploadCampImages(req.files?.images || []);
  if (newImages.length) {
    const baseOrder = camp.images?.length || 0;
    newImages.forEach((img, i) => {
      img.order = baseOrder + i;
    });
    camp.images = [...(camp.images || []), ...newImages];
  }

  await applyHeroImage(
    camp,
    { heroImage, coverImage, heroIndex, coverIndex },
    req.files?.hero?.[0],
    newImages,
  );

  camp.updatedAt = new Date().toISOString();
  await camp.save();

  res.json(normalizeCamp(camp.toObject()));
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  const result = await Camp.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Camp not found' });
  res.json({ message: 'Camp deleted' });
});

module.exports = router;
