const express = require('express');
const {
  Blog,
  Camp,
  Article,
  Report,
  TeamMember,
  User,
  Invite,
  MapLocation,
} = require('../models');
const { protect, contentManagers } = require('../auth');

const router = express.Router();

router.get('/stats', protect, contentManagers, async (req, res) => {
  const [blogs, camps, articles, reports, team, users, pendingInvites, mapLocations] =
    await Promise.all([
      Blog.countDocuments(),
      Camp.countDocuments(),
      Article.countDocuments(),
      Report.countDocuments(),
      TeamMember.countDocuments(),
      User.countDocuments(),
      Invite.countDocuments({ status: 'pending' }),
      MapLocation.countDocuments(),
    ]);

  res.json({
    blogs,
    camps,
    articles,
    reports,
    team,
    users,
    pendingInvites,
    mapLocations,
  });
});

module.exports = router;
