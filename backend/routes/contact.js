const express = require('express');
const { Contact } = require('../models');
const generateId = require('../lib/generateId');
const { sendOrgMail, receiverEmail } = require('../lib/mail');
const { protect, contentManagers, adminOrSuper } = require('../auth');

const router = express.Router();

const SOURCE_LABELS = {
  contact: 'Contact Us',
  'know-your-rights': 'Know Your Rights — Ask',
  donate: 'Donate inquiry',
  general: 'Website message',
};

/** Admin inbox — must be registered before /:id */
router.get('/', protect, contentManagers, async (req, res) => {
  const filter = {};
  if (req.query.source) filter.source = req.query.source;
  if (req.query.unread === 'true') filter.read = { $ne: true };
  const items = await Contact.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.get('/:id', protect, contentManagers, async (req, res) => {
  const item = await Contact.findOne({ id: req.params.id }).lean();
  if (!item) return res.status(404).json({ message: 'Message not found' });
  res.json(item);
});

router.patch('/:id', protect, contentManagers, async (req, res) => {
  const item = await Contact.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ message: 'Message not found' });
  if (req.body.read !== undefined) item.read = req.body.read === true || req.body.read === 'true';
  await item.save();
  res.json(item.toObject());
});

router.delete('/:id', protect, adminOrSuper, async (req, res) => {
  const result = await Contact.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: 'Message deleted' });
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email = '',
      phone = '',
      message,
      source = 'contact',
      subject: customSubject,
    } = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();
    const cleanMessage = String(message || '').trim();
    const cleanSource = String(source || 'contact').trim() || 'contact';

    if (!cleanName) return res.status(400).json({ message: 'Name is required' });
    if (!cleanMessage) return res.status(400).json({ message: 'Message is required' });
    if (!cleanEmail && !cleanPhone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    const contact = await Contact.create({
      id: generateId('contact'),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      source: cleanSource,
      read: false,
      createdAt: new Date().toISOString(),
    });

    const sourceLabel = SOURCE_LABELS[cleanSource] || SOURCE_LABELS.general;
    const subject =
      String(customSubject || '').trim() ||
      `[RKLAF] ${sourceLabel} — ${cleanName}`;

    const text = [
      `New message from the RKLAF website`,
      ``,
      `Source: ${sourceLabel}`,
      `Name: ${cleanName}`,
      `Email: ${cleanEmail || '—'}`,
      `Phone: ${cleanPhone || '—'}`,
      ``,
      `Message:`,
      cleanMessage,
      ``,
      `—`,
      `Delivered to: ${receiverEmail()}`,
    ].join('\n');

    const html = `
      <div style="font-family:Georgia,serif;color:#1f1c19;line-height:1.5">
        <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8d6b40">
          ${sourceLabel}
        </p>
        <p><strong>Name:</strong> ${escapeHtml(cleanName)}<br/>
        <strong>Email:</strong> ${escapeHtml(cleanEmail || '—')}<br/>
        <strong>Phone:</strong> ${escapeHtml(cleanPhone || '—')}</p>
        <p style="white-space:pre-wrap;border-left:3px solid #c4b19a;padding-left:12px">${escapeHtml(cleanMessage)}</p>
      </div>
    `;

    const mailResult = await sendOrgMail({
      subject,
      text,
      html,
      replyTo: cleanEmail || undefined,
    });

    res.status(201).json({
      message: 'Message received. We will reply soon.',
      contact: contact.toObject(),
      emailed: Boolean(mailResult.sent),
      // Helps debug Render SMTP without opening logs
      mailError: mailResult.sent ? undefined : mailResult.error || undefined,
      mailSkipped: Boolean(mailResult.skipped),
    });
  } catch (err) {
    console.error('[contact]', err);
    res.status(500).json({ message: 'Could not send your message. Please try again or WhatsApp us.' });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = router;
