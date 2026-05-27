const { load, save } = require('./persist');
const seedMapLocations = require('./data/seedMapLocations');

let db = load();

if (!db.mapLocations) {
  db.mapLocations = seedMapLocations;
  save(db);
}

const store = {
  get users() { return db.users; },
  set users(v) { db.users = v; save(db); },
  get invites() { return db.invites; },
  set invites(v) { db.invites = v; save(db); },
  get blogs() { return db.blogs; },
  get articles() { return db.articles; },
  get reports() { return db.reports; },
  get cases() { return db.cases; },
  get camps() { return db.camps; },
  get faqs() { return db.faqs; },
  get team() { return db.team; },
  get contacts() { return db.contacts; },
  get mapLocations() { return db.mapLocations || []; },
  set mapLocations(v) { db.mapLocations = v; save(db); }
};

function persist() {
  save(db);
}

function reload() {
  db = load();
}

module.exports = store;
module.exports.persist = persist;
module.exports.reload = reload;
