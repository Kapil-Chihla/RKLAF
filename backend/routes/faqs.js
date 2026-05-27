const express = require('express');
const store = require('../dataStore');
const { protect, adminOnly } = require('../auth');

const router = express.Router();

router.get('/', (req, res) => res.json(store.faqs));

router.post('/', protect, adminOnly, (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });
  const faq = { id: `faq-${Date.now()}`, question, answer };
  store.faqs.push(faq);
  res.status(201).json(faq);
});

module.exports = router;
