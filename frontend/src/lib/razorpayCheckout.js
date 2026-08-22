import { API_BASE } from './api';

function loadCheckoutScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay Checkout')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay Checkout'));
    document.body.appendChild(script);
  });
}

async function resolveKeyId() {
  // Prefer backend public-config so Key ID always matches the secret in use
  try {
    const res = await fetch(`${API_BASE}/payment/public-config`);
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.key) return data.key;
  } catch {
    /* fall through to Vite env */
  }

  const fromEnv = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (fromEnv) return fromEnv;

  throw new Error('Razorpay key is not configured');
}

/**
 * Open Razorpay Standard Checkout for a donation.
 * @param {object} opts
 * @param {number} opts.amountInr — rupees (converted to paise for the API)
 * @param {string} opts.name
 * @param {string} opts.email
 * @param {string} [opts.programTitle]
 * @param {string} [opts.pan]
 */
export async function startDonationCheckout({
  amountInr,
  name,
  email,
  programTitle,
  pan,
}) {
  const amountPaise = Math.round(Number(amountInr) * 100);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    throw new Error('Minimum donation is ₹1');
  }

  await loadCheckoutScript();

  const orderRes = await fetch(`${API_BASE}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: `donate_${Date.now()}`,
    }),
  });
  const order = await orderRes.json().catch(() => ({}));
  if (!orderRes.ok) {
    throw new Error(order.message || 'Could not create payment order');
  }

  const key = await resolveKeyId();

  return new Promise((resolve, reject) => {
    let settled = false;

    const rzp = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'Radhey Krishna Legal Aid Foundation',
      description: programTitle || 'Donation',
      order_id: order.order_id,
      prefill: {
        name: name || '',
        email: email || '',
      },
      notes: {
        programme: programTitle || '',
        pan: pan || '',
      },
      theme: { color: '#1a3a2a' },
      handler: async (response) => {
        try {
          const verifyRes = await fetch(`${API_BASE}/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verify = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok || !verify.success) {
            throw new Error(verify.message || 'Payment verification failed');
          }
          settled = true;
          resolve({ ...response, verified: true });
        } catch (err) {
          settled = true;
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          if (!settled) {
            settled = true;
            reject(new Error('Payment cancelled'));
          }
        },
      },
    });

    rzp.on('payment.failed', (resp) => {
      if (settled) return;
      settled = true;
      const msg =
        resp?.error?.description ||
        resp?.error?.reason ||
        'Payment failed. Please try again.';
      reject(new Error(msg));
    });

    rzp.open();
  });
}
