const { MapLocation } = require('../models');
const seedData = require('../data/seedMapLocations');

async function seedMapLocationsIfEmpty() {
  const count = await MapLocation.countDocuments();
  if (count > 0) return;
  await MapLocation.insertMany(seedData);
  console.log(`Seeded ${seedData.length} map locations`);
}

module.exports = seedMapLocationsIfEmpty;
