const slugify = require('slugify');
const { GuideCategory } = require('../models');
const generateId = require('./generateId');

async function ensureGuideCategory(name) {
  const trimmed = (name || 'General').trim() || 'General';
  const existing = await GuideCategory.findOne({ name: trimmed }).lean();
  if (existing) return existing.name;

  await GuideCategory.create({
    id: generateId('cat'),
    name: trimmed,
    slug: slugify(trimmed, { lower: true, strict: true }),
    createdAt: new Date().toISOString(),
  });
  return trimmed;
}

module.exports = ensureGuideCategory;
