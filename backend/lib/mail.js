const nodemailer = require('nodemailer');

const ORG_EMAIL = 'radheykrishnalegalaid@gmail.com';

function receiverEmail() {
  return (process.env.CONTACT_RECEIVER_EMAIL || ORG_EMAIL).trim() || ORG_EMAIL;
}

function canSendMail() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
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
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send an inbound site message to the organisation inbox.
 * Returns { sent: boolean, skipped?: boolean, error?: string }
 */
async function sendOrgMail({ subject, text, html, replyTo }) {
  if (!canSendMail()) {
    console.warn(
      '[mail] SMTP_USER / SMTP_PASS not set — message saved to DB only. Configure Gmail App Password to deliver mail.',
    );
    return { sent: false, skipped: true };
  }

  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"RKLAF Website" <${from}>`,
      to: receiverEmail(),
      replyTo: replyTo || undefined,
      subject,
      text,
      html: html || undefined,
    });
    return { sent: true };
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
