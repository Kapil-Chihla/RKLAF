const express = require('express');
const {
  Blog,
  Camp,
  Article,
  Report,
  TeamMember,
  User,
  Invite,
  DeskStory,
  SuccessStory,
  Paper,
  ExplainerVideo,
  Contact,
  RunningNow,
  ToldInFull,
  AlsoOnRecord,
  PressMention,
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
    deskStories,
    successStories,
    papers,
    explainerVideos,
    contacts,
    unreadContacts,
    runningNow,
    toldInFull,
    alsoOnRecord,
    pressMentions,
  ] = await Promise.all([
    Blog.countDocuments(),
    Camp.countDocuments(),
    Article.countDocuments(),
    Report.countDocuments(),
    TeamMember.countDocuments(),
    User.countDocuments(),
    Invite.countDocuments({ status: 'pending' }),
    DeskStory.countDocuments(),
    SuccessStory.countDocuments(),
    Paper.countDocuments(),
    ExplainerVideo.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ read: { $ne: true } }),
    RunningNow.countDocuments(),
    ToldInFull.countDocuments(),
    AlsoOnRecord.countDocuments(),
    PressMention.countDocuments(),
  ]);

  res.json({
    blogs,
    camps,
    articles,
    reports,
    team,
    users,
    pendingInvites,
    deskStories,
    successStories,
    papers,
    explainerVideos,
    contacts,
    unreadContacts,
    runningNow,
    toldInFull,
    alsoOnRecord,
    pressMentions,
  });
});

module.exports = router;
