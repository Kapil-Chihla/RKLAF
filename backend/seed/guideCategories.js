const { GuideCategory } = require('../models');
const seedData = require('../data/seedGuideCategories');

async function seedGuideCategoriesIfEmpty() {
  const count = await GuideCategory.countDocuments();
  if (count > 0) return;

  const now = new Date().toISOString();
  await GuideCategory.insertMany(
    seedData.map((name, i) => ({
      id: `cat-seed-${i}`,
      name,
      slug: slugify(name, { lower: true, strict: true }),
      createdAt: now,
    }))
  );
  console.log(`Seeded ${seedData.length} guide categories`);
}

module.exports = seedGuideCategoriesIfEmpty;
