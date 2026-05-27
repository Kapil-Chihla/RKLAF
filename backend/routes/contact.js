const express = require('express');
const nodemailer = require('nodemailer');
const { Contact } = require('../models');
const generateId = require('../lib/generateId');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email and message are required' });

  const contact = await Contact.create({
    id: generateId('contact'),
    name,
    email,
    phone: phone || '',
    message,
    createdAt: new Date().toISOString(),
  });

  if (process.env.SMTP_HOST && process.env.CONTACT_RECEIVER_EMAIL) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || email,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `Legal Aid Contact - ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\n${message}`,
    });
  }

  res.status(201).json({ message: 'Contact request received', contact: contact.toObject() });
});

module.exports = router;
