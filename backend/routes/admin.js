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
  DeskStory,
  SuccessStory,
  Paper,
} = require('../models');
const { protect, contentManagers } = require('../auth');

const router = express.Router();

router.get('/stats', protect, contentManagers, async (req, res) => {
  const [
    blogs,
    camps,
    articles,
    reports,
    team,
    users,
    pendingInvites,
    mapLocations,
    deskStories,
    successStories,
    papers,
  ] = await Promise.all([
    Blog.countDocuments(),
    Camp.countDocuments(),
    Article.countDocuments(),
    Report.countDocuments(),
    TeamMember.countDocuments(),
    User.countDocuments(),
    Invite.countDocuments({ status: 'pending' }),
    MapLocation.countDocuments(),
    DeskStory.countDocuments(),
    SuccessStory.countDocuments(),
    Paper.countDocuments(),
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
    deskStories,
    successStories,
    papers,
  });
});

module.exports = router;
