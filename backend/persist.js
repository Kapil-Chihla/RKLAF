const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultDb = {
  users: [],
  invites: [],
  blogs: [],
  articles: [],
  reports: [],
  cases: [],
  camps: [],
  faqs: [
    { id: 'faq-1', question: 'How can I request legal help?', answer: 'Use the contact form and our team will get back to you.' },
    { id: 'faq-2', question: 'Do you handle criminal cases?', answer: 'Yes, our team supports multiple areas including criminal matters.' }
  ],
  team: [],
  contacts: [],
  mapLocations: []
};

function load() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
    return { ...defaultDb };
  }
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return { ...defaultDb, ...JSON.parse(raw) };
}

function save(db) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

module.exports = { load, save, DB_FILE };
