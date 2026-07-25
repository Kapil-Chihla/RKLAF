import { useState } from 'react';
import Reveal from '../components/motion/Reveal';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '../data/navigation';
import './Contact.css';

const channels = [
  {
    id: 'helpline',
    icon: 'phone',
    title: 'Helpline',
    detail: `${WHATSAPP_DISPLAY} · Mon to Sat, 9am to 6pm · Hindi, English & Braj`,
    href: 'tel:+917043031263',
  },
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
    detail: 'help@rklaf.org · replies within one working day',
    href: 'mailto:help@rklaf.org',
  },
  {
    id: 'office',
    icon: 'pin',
    title: 'Head office',
    detail: 'Sector 14, Gurgaon, Haryana · walk-ins Tue & Thu',
    href: null,
  },
];

function ChannelIcon({ name }) {
  if (name === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M8 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L22 14v3a2 2 0 01-2 2A15 15 0 015 5a2 2 0 012-2h1z" />
      </svg>
    );
  }
  if (name === 'chat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M5 6a3 3 0 013-3h8a3 3 0 013 3v7a3 3 0 01-3 3H10l-4 3v-3H8a3 3 0 01-3-3V6z" />
      </svg>
    );
  }
  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 7 9-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [matter, setMatter] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const text = [
      'Hello, I am contacting RKLAF from the Contact Us page.',
      name.trim() && `Name: ${name.trim()}`,
      phone.trim() && `Phone: ${phone.trim()}`,
      matter.trim() && `Matter: ${matter.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(
      `https://wa.me/917043031263?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    );
    setSent(true);
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
            <h1>Talk to a human, today</h1>
            <p className="contact__lead">
              Every message gets a reply within 24 hours. Urgent matters are routed straight to a duty
              advocate.
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

          <Reveal as="div" className="contact__map" variant="up" delay={80} aria-hidden="true">
            <span className="contact__map-icon">
              <ChannelIcon name="pin" />
            </span>
            <p>Map embed placeholder</p>
            <small>Google Maps pin: RKLAF head office</small>
          </Reveal>
        </div>

        <Reveal as="div" className="contact__form-wrap" variant="up" delay={60}>
          <form className="contact__form" onSubmit={onSubmit}>
            <h2>Send us your matter</h2>
            <p className="contact__form-lead">
              Share only what you&apos;re comfortable with. Everything is confidential.
            </p>

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
                />
              </label>
            </div>

            <label className="contact__matter">
              What&apos;s going on?
              <textarea
                rows={5}
                value={matter}
                onChange={(e) => setMatter(e.target.value)}
                placeholder="A few lines about your situation. No legal language needed."
                required
              />
            </label>

            <button type="submit" className="contact__submit">
              {sent ? 'Opening WhatsApp…' : 'Send message →'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
