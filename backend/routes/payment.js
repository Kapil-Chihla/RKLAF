const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const router = express.Router();

function getClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

/** POST /api/payment/create-order — amount in paise (min 100) */
router.post('/create-order', async (req, res) => {
  try {
    const razorpay = getClient();
    if (!razorpay) {
      return res.status(401).json({ message: 'Razorpay keys are not configured' });
    }

    const currency = (req.body?.currency || 'INR').toUpperCase();
    const amount = Math.round(Number(req.body?.amount));
    const receipt = req.body?.receipt || `rcpt_${Date.now()}`;

    if (!Number.isFinite(amount) || amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise (₹1)' });
    }

    const order = await razorpay.orders.create({ amount, currency, receipt });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    const authFail =
      err.statusCode === 401 ||
      err.statusCode === 403 ||
      /auth|unauthorized|authentication/i.test(err.message || '');
    const status = authFail ? 401 : 500;
    const message =
      err.error?.description || err.message || 'Failed to create Razorpay order';
    console.error('[payment/create-order]', message);
    res.status(status).json({ message });
  }
});

/** POST /api/payment/verify-payment — HMAC-SHA256(order_id|payment_id) */
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature',
    });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(401).json({ success: false, message: 'Razorpay keys are not configured' });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Payment signature mismatch',
    });
  }

  res.json({
    success: true,
    message: 'Payment verified',
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
  });
});

/** GET /api/payment/public-config — Key ID only (never secret) */
router.get('/public-config', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || '' });
});

module.exports = router;
