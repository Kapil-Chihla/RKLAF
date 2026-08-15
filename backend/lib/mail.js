const nodemailer = require('nodemailer');

const ORG_EMAIL = 'radheykrishnalegalaid@gmail.com';

function receiverEmail() {
  return (process.env.CONTACT_RECEIVER_EMAIL || ORG_EMAIL).trim() || ORG_EMAIL;
}

function hasResend() {
  return Boolean(String(process.env.RESEND_API_KEY || '').trim());
}

function hasSmtp() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function canSendMail() {
  return hasResend() || hasSmtp();
}

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = port === 465 || process.env.SMTP_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: String(process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
  });
}

/**
 * Resend HTTPS API — works on Render (Gmail SMTP port 587 often times out there).
 */
async function sendViaResend({ subject, text, html, replyTo }) {
  const from =
    (process.env.RESEND_FROM || '').trim() ||
    'RKLAF Website <onboarding@resend.dev>';

  const body = {
    from,
    to: [receiverEmail()],
    subject,
    text,
    html: html || undefined,
  };
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${String(process.env.RESEND_API_KEY).trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.error || `Resend HTTP ${res.status}`;
    throw new Error(msg);
  }
  return { sent: true, provider: 'resend', id: data.id };
}

async function sendViaSmtp({ subject, text, html, replyTo }) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"RKLAF Website" <${from}>`,
    to: receiverEmail(),
    replyTo: replyTo || undefined,
    subject,
    text,
    html: html || undefined,
  });
  return { sent: true, provider: 'smtp' };
}

/**
 * Send an inbound site message to the organisation inbox.
 * Prefers Resend (HTTPS) over SMTP — Render free tier often blocks Gmail SMTP.
 * Returns { sent: boolean, skipped?: boolean, error?: string, provider?: string }
 */
async function sendOrgMail({ subject, text, html, replyTo }) {
  if (!canSendMail()) {
    console.warn(
      '[mail] No RESEND_API_KEY or SMTP credentials — message saved to DB only.',
    );
    return {
      sent: false,
      skipped: true,
      error: 'RESEND_API_KEY or SMTP_USER/SMTP_PASS not set on the server',
    };
  }

  try {
    if (hasResend()) {
      return await sendViaResend({ subject, text, html, replyTo });
    }
    return await sendViaSmtp({ subject, text, html, replyTo });
  } catch (err) {
    console.error('[mail] send failed:', err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = {
  ORG_EMAIL,
  receiverEmail,
  canSendMail,
  sendOrgMail,
};
