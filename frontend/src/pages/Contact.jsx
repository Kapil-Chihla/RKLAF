import { useState } from 'react';
import Reveal from '../components/motion/Reveal';
import {
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  OFFICE_DELHI,
} from '../data/navigation';
import { submitContact } from '../lib/submitContact';
import './Contact.css';

const channels = [
  {
    id: 'whatsapp',
    icon: 'chat',
    title: 'WhatsApp',
    detail: `${WHATSAPP_DISPLAY} · voice notes welcome`,
    href: WHATSAPP_URL,
    external: true,
  },
  {
    id: 'email',
    icon: 'mail',
    title: 'Email',
    detail: `${CONTACT_EMAIL} · replies within one working day`,
    href: CONTACT_MAILTO,
  },
  {
    id: 'office',
    icon: 'pin',
    title: OFFICE_DELHI.title,
    detail: OFFICE_DELHI.short,
    href: OFFICE_DELHI.mapsUrl,
    external: true,
  },
];

function ChannelIcon({ name }) {
  if (name === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.35a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.75.34 1.54.57 2.35.7A2 2 0 0122 16.92z" />
      </svg>
    );
  }
  if (name === 'chat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    );
  }
  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 7 9-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matter, setMatter] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: matter.trim(),
        source: 'contact',
      });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMatter('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send. Please try WhatsApp or email us directly.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="contact contact--v2">
      <div className="container contact__grid">
        <div className="contact__intro">
          <Reveal as="header" variant="up">
            <p className="contact__label">
              <span className="contact__label-rule" aria-hidden="true" />
              Contact us
            </p>
            <h1>Have a Question? Need Assistance? Let&apos;s Talk.</h1>
            <p className="contact__lead">
              Whether you are seeking legal assistance, have a question about our programmes, wish to
              collaborate, or simply want to learn more about RKLAF, we welcome you to reach out.
            </p>
          </Reveal>

          <Reveal as="ul" className="contact__channels" variant="up" delay={40}>
            {channels.map((c) => {
              const body = (
                <>
                  <span className="contact__channel-icon">
                    <ChannelIcon name={c.icon} />
                  </span>
                  <span className="contact__channel-text">
                    <strong>{c.title}</strong>
                    <small>{c.detail}</small>
                  </span>
                </>
              );

              return (
                <li key={c.id}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="contact__channel"
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="contact__channel">{body}</div>
                  )}
                </li>
              );
            })}
          </Reveal>

          <Reveal as="div" className="contact__map" variant="up" delay={80}>
            <iframe
              title="RKLAF head office on Google Maps"
              src={OFFICE_DELHI.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              className="contact__map-link"
              href={OFFICE_DELHI.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps →
            </a>
          </Reveal>
        </div>

        <Reveal as="div" className="contact__form-wrap" variant="up" delay={60}>
          <form className="contact__form" onSubmit={onSubmit}>
            <h2>Legal Assistance &amp; General Enquiries</h2>
            <p className="contact__form-lead">
              If you or someone you know requires legal assistance, share details of the matter. For questions
              relating to RKLAF, programmes, internships, volunteering, membership or partnerships, write to us
              here. Everything is confidential. Messages go to{' '}
              {CONTACT_EMAIL}.
            </p>

            {error ? <p className="contact__form-error" role="alert">{error}</p> : null}
            {sent ? (
              <p className="contact__form-success" role="status">
                Sent — a volunteer will reply within 24 hours.
              </p>
            ) : null}

            <div className="contact__fields">
              <label>
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  disabled={busy}
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91"
                  required
                  autoComplete="tel"
                  disabled={busy}
                />
              </label>
            </div>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                disabled={busy}
              />
            </label>

            <label className="contact__matter">
              What&apos;s going on?
              <textarea
                rows={5}
                value={matter}
                onChange={(e) => setMatter(e.target.value)}
                placeholder="A few lines about your situation. No legal language needed."
                required
                disabled={busy}
              />
            </label>

            <button type="submit" className="contact__submit" disabled={busy}>
              {busy ? 'Sending…' : sent ? 'Send another message →' : 'Send message →'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
