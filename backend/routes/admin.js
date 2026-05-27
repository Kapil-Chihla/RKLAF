const express = require('express');
const store = require('../dataStore');
const { protect, contentManagers } = require('../auth');

const router = express.Router();

router.get('/stats', protect, contentManagers, (req, res) => {
  res.json({
    blogs: store.blogs.length,
    cases: store.cases.length,
    camps: store.camps.length,
    articles: store.articles.length,
    reports: store.reports.length,
    team: store.team.length,
    users: store.users.length,
    pendingInvites: store.invites.filter((i) => i.status === 'pending').length,
    mapLocations: (store.mapLocations || []).length
  });
});

module.exports = router;
