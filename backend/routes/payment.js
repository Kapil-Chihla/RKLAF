const express = require('express');
const Razorpay = require('razorpay');

const router = express.Router();

router.post('/create-order', async (req, res) => {
  const { amount = 1000, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body || {};
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(400).json({ message: 'Razorpay keys are not configured' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const order = await razorpay.orders.create({ amount, currency, receipt });
  res.json({ order });
});

router.get('/public-config', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || '' });
});

module.exports = router;
