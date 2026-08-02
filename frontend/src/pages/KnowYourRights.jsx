import { useEffect, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import FaqAccordion from '../components/FaqAccordion';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '../data/navigation';
import mapImage from '../assets/map.webp';
import worldGlobe from '../assets/world.webp';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import './KnowYourRights.css';

const GUIDE_TONES = ['plum', 'cream', 'ink', 'sage', 'gold', 'clay', 'olive'];

const doors = [
  {
    icon: 'book',
    title: 'Legal Glossary',
    desc: 'Plain definitions for the words that show up in FIRs, petitions, and orders.',
    cta: 'Browse A to Z →',
    href: '#glossary',
  },
  {
    icon: 'compass',
    title: 'Practical Guides',
    desc: 'Short reads for one situation at a time — what to do, who to call, what to bring.',
    cta: 'Read a guide →',
    href: '#guides',
  },
  {
    icon: 'film',
    title: 'Explainer Videos',
    desc: 'Two-minute explainers in Hindi and English, for camps and first-time readers.',
    cta: 'Watch now →',
    href: '#videos',
  },
  {
    icon: 'phone',
    title: 'Emergency Contacts',
    desc: 'Helplines to save before you need them — ours and the national numbers.',
    cta: 'Save numbers →',
    href: '#emergency',
  },
];

const glossaryPills = [
  { term: 'Affidavit', def: 'a written statement you swear is true', hot: false },
  { term: 'Maintenance', def: 'money a court can order for food, shelter, care', hot: true },
  { term: 'FIR', def: 'First Information Report — how a cognizable offence is recorded', hot: false },
  { term: 'Bail', def: 'temporary release while a case is pending', hot: false },
  { term: 'Section 23', def: 'cancels a gift or transfer made under pressure by an elder', hot: true },
  { term: 'Injunction', def: 'a court order to do — or stop doing — something', hot: false },
  { term: 'PIL', def: 'Public Interest Litigation for rights that affect many', hot: false },
  { term: 'Petition', def: 'a formal written request to a court or authority', hot: false },
  { term: 'Cognizable', def: 'an offence police can investigate without a court order first', hot: false },
  { term: 'Legal aid', def: 'free counsel when you cannot afford a private lawyer', hot: false },
];

const guides = [
  {
    id: 'inquiry',
    title: 'Handbook on Inquiry Procedure',
    cover: 'Inquiry procedure · plain language',
    tone: 'plum',
    href: '#',
  },
  {
    id: 'jagriti',
    title: 'Jagriti — Rights at a Glance',
    cover: 'Monthly rights digest',
    tone: 'cream',
    href: '#',
  },
  {
    id: 'stalking',
    title: 'Stalking — Know Your Protections',
    cover: 'Protection orders & remedies',
    tone: 'ink',
    href: '#',
  },
  {
    id: 'mansik',
    title: 'Mansik Shakti — Mental Health Rights',
    cover: 'Care, consent & legal options',
    tone: 'sage',
    href: '#',
  },
  {
    id: 'seniors',
    title: 'Your Children Cannot Throw You Out',
    cover: 'Senior Citizens Act guide',
    tone: 'gold',
    href: '#',
  },
  {
    id: 'fir',
    title: 'Filing an FIR That Gets Registered',
    cover: 'Zero FIR & free copy rights',
    tone: 'clay',
    href: '#',
  },
  {
    id: 'wages',
    title: 'Recovering Unpaid Wages in 3 Steps',
    cover: 'Labour commissioner route',
    tone: 'olive',
    href: '#',
  },
  {
    id: 'dv',
    title: 'Protection Orders under the DV Act',
    cover: 'Relief tonight vs next month',
    tone: 'rose',
    href: '#',
  },
];

const videos = [
  {
    title: 'The Senior Citizens Act in 8 minutes',
    meta: '24K views · Hindi & English subtitles',
  },
  {
    title: 'Your first day in court',
    meta: '90 sec animated short',
  },
  {
    title: 'Reading a gift deed before signing',
    meta: '2 min · from our camps',
  },
];

const emergency = [
  {
    number: '1800-XXX',
    label: 'RKLAF free legal helpline · Mon to Sat, 9 to 6',
    href: 'tel:+917043031263',
    featured: true,
  },
  { number: '112', label: 'National emergency number, all services', href: 'tel:112' },
  { number: '1091', label: "Women's helpline, 24 hours", href: 'tel:1091' },
  { number: '14567', label: 'Elder line, national helpline for senior citizens', href: 'tel:14567' },
  { number: '1098', label: 'Childline, for children in distress', href: 'tel:1098' },
];

const kyrFaqs = [
  {
    id: 'kyr-1',
    question: 'Is your legal help really free?',
    answer:
      'Yes, completely. Consultations, drafting and court representation are funded by donors and members. A client never pays us anything, at any stage.',
  },
  {
    id: 'kyr-2',
    question: 'Do I need documents to get advice at a camp?',
    answer:
      'Bring what you have — ID, any notice, gift deed, FIR, or court paper. If you have nothing yet, come anyway. Volunteers will tell you exactly what to collect next.',
  },
  {
    id: 'kyr-3',
    question: 'Can you help if my case is in another state?',
    answer:
      'Often yes. We assess jurisdiction on the call, and where we cannot appear ourselves we route you to a trusted desk or legal-aid partner in that state.',
  },
  {
    id: 'kyr-4',
    question: 'What happens after I call the helpline?',
    answer:
      'A volunteer logs your matter, a case officer calls back, and you get a clear next step — camp visit, document list, or filing plan — usually within one working day.',
  },
  {
    id: 'kyr-5',
    question: 'Can NRIs use these services for matters in India?',
    answer:
      'Yes. Our NRI desk guides overseas Indians through property, family, and RTI matters back home, with a named officer on the Indian side.',
  },
];

function DoorIcon({ name }) {
  if (name === 'book') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 5a2 2 0 012-2h11v18H6a2 2 0 01-2-2V5z" />
        <path d="M8 7h6M8 11h6M8 15h4" />
      </svg>
    );
  }
  if (name === 'compass') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9.5l-2 5-5 2 2-5 5-2z" />
      </svg>
    );
  }
  if (name === 'film') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M10 9l5 3-5 3V9z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L22 14v3a2 2 0 01-2 2A15 15 0 015 5a2 2 0 012-2h1z" />
    </svg>
  );
}

export default function KnowYourRights() {
  const [question, setQuestion] = useState('');
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);
  const [guideList, setGuideList] = useState(guides);

  useEffect(() => {
    publicApi
      .get('/articles')
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        setGuideList(
          r.data.map((a, i) => ({
            id: a.id,
            title: a.title,
            cover: a.summary || a.category || 'Practical guide',
            tone: GUIDE_TONES[i % GUIDE_TONES.length],
            href: a.file ? assetUrl(a.file) : '#',
            coverImage: a.coverImage ? assetUrl(a.coverImage) : null,
          })),
        );
      })
      .catch(() => {});
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const text = [
      'Hello, I have a Know Your Rights question from the website.',
      question.trim() && `Question: ${question.trim()}`,
      contact.trim() && `Reply to: ${contact.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(
      `https://wa.me/917043031263?text=${encodeURIComponent(text || 'Hello from Know Your Rights')}`,
      '_blank',
      'noopener,noreferrer',
    );
    setSent(true);
  };

  return (
    <div className="kyr kyr--v2">
      {/* Hero */}
      <header className="kyr-hero">
        <div className="container kyr-hero__grid">
          <Reveal as="div" className="kyr-hero__copy" variant="up">
            <span className="kyr-rule" aria-hidden="true" />
            <h1>
              Rights begin where <em>confusion</em> ends
            </h1>
            <p className="kyr-hero__lead">
              Everything on this page is written for first-time readers: plain words, short reads, real
              examples. Start anywhere. The law belongs to you.
            </p>
            <a href="#ask" className="kyr-pill">
              <span className="kyr-pill__dot" aria-hidden="true" />
              Get free legal aid
            </a>
          </Reveal>

          <Reveal as="div" className="kyr-hero__visual" variant="scale" delay={80}>
            <div className="kyr-mapframe" aria-hidden="true">
              <span className="kyr-mapframe__dot kyr-mapframe__dot--a" />
              <span className="kyr-mapframe__dot kyr-mapframe__dot--b" />
              <span className="kyr-mapframe__dot kyr-mapframe__dot--c" />
              <span className="kyr-mapframe__dot kyr-mapframe__dot--d" />
              <div className="kyr-mapframe__board">
                <img src={mapImage} alt="" className="kyr-mapframe__img" />
                <div className="kyr-mapframe__wash" />
              </div>
              <img src={worldGlobe} alt="" className="kyr-mapframe__ghost" />
            </div>
          </Reveal>
        </div>
      </header>

      {/* Four doors */}
      <section id="doors" className="kyr-doors">
        <div className="container">
          <Reveal as="header" className="kyr-center-head" variant="up">
            <p className="kyr-label">How this hub helps</p>
            <h2>Four doors into the law</h2>
          </Reveal>

          <div className="kyr-doors__grid">
            {doors.map((d, i) => (
              <Reveal key={d.title} as="article" className="kyr-door" variant="up" delay={i * 50}>
                <span className="kyr-door__icon">
                  <DoorIcon name={d.icon} />
                </span>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
                <a href={d.href} className="kyr-door__cta">
                  {d.cta}
                </a>
              </Reveal>
            ))}
          </div>

          <div className="kyr-doors__watermark" aria-hidden="true">
            <img src={mapImage} alt="" />
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section id="glossary" className="kyr-glossary">
        <div className="container">
          <Reveal as="header" className="kyr-center-head" variant="up">
            <p className="kyr-label">Legal glossary</p>
            <h2>Words that stop scaring you once you know them</h2>
          </Reveal>

          <Reveal as="div" className="kyr-pills" variant="up" delay={40}>
            {glossaryPills.map((p) => (
              <span key={p.term} className={`kyr-pill-term ${p.hot ? 'kyr-pill-term--hot' : ''}`}>
                <strong>{p.term}</strong> {p.def}
              </span>
            ))}
          </Reveal>

          <p className="kyr-more">
            <a href="#guides">View all 120+ terms →</a>
          </p>
        </div>
      </section>

      {/* Practical guides — PDF card grid */}
      <section id="guides" className="kyr-guides">
        <div className="container">
          <Reveal as="header" className="kyr-guides__head" variant="up">
            <span className="kyr-rule" aria-hidden="true" />
            <h2>Practical guides, one situation at a time</h2>
            <p>Downloadable PDF handbooks — cover, title, and a one-click download.</p>
          </Reveal>

          <div className="kyr-guides__cards">
            {guideList.map((g, i) => (
              <Reveal key={g.id} as="article" className="kyr-pdf" variant="up" delay={i * 40}>
                <div
                  className={`kyr-pdf__cover kyr-pdf__cover--${g.tone}`}
                  style={
                    g.coverImage
                      ? {
                          backgroundImage: `linear-gradient(rgba(20,16,12,0.35), rgba(20,16,12,0.55)), url(${g.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                  aria-hidden="true"
                >
                  <span className="kyr-pdf__badge">PDF</span>
                  <strong>{g.cover}</strong>
                </div>
                <h3 className="kyr-pdf__title" title={g.title}>
                  {g.title}
                </h3>
                <a
                  className="kyr-pdf__dl"
                  href={g.href}
                  target={g.href !== '#' ? '_blank' : undefined}
                  rel={g.href !== '#' ? 'noopener noreferrer' : undefined}
                  download={g.href !== '#' ? true : undefined}
                  aria-label={`Download ${g.title}`}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 4v10M8 10l4 4 4-4" />
                    <path d="M5 18h14" />
                  </svg>
                  Download
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="kyr-videos">
        <div className="container">
          <Reveal as="header" className="kyr-center-head" variant="up">
            <p className="kyr-label">Explainer videos</p>
            <h2>Watch it in two minutes</h2>
          </Reveal>

          <div className="kyr-videos__grid">
            {videos.map((v, i) => (
              <Reveal key={v.title} as="article" className="kyr-video" variant="up" delay={i * 50}>
                <button type="button" className="kyr-video__thumb" aria-label={`Play: ${v.title}`}>
                  <span className="kyr-video__ph">Video thumbnail</span>
                  <span className="kyr-video__play" aria-hidden="true">
                    ▶
                  </span>
                </button>
                <div className="kyr-video__meta">
                  <h3>{v.title}</h3>
                  <p>{v.meta}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section id="emergency" className="kyr-emergency">
        <div className="container">
          <Reveal as="header" variant="up">
            <p className="kyr-label kyr-label--on-dark">Emergency contacts</p>
            <h2>Save these before you need them</h2>
          </Reveal>

          <div className="kyr-emergency__grid">
            {emergency.map((c, i) => (
              <Reveal key={c.number} as="div" variant="up" delay={i * 40}>
                <a
                  href={c.href}
                  className={`kyr-emcard ${c.featured ? 'kyr-emcard--featured' : ''}`}
                >
                  <strong>
                    {c.number === '1800-XXX' ? WHATSAPP_DISPLAY.replace(/\s/g, '') : c.number}
                  </strong>
                  <span>
                    {c.number === '1800-XXX'
                      ? 'RKLAF free legal helpline · Mon to Sat, 9 to 6'
                      : c.label}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="kyr-faqs">
        <div className="container kyr-faqs__inner">
          <Reveal as="header" className="kyr-center-head" variant="up">
            <p className="kyr-label">FAQs</p>
            <h2>Asked at every camp</h2>
          </Reveal>
          <Reveal as="div" className="kyr-faqs__list" variant="up" delay={40}>
            <FaqAccordion items={kyrFaqs} className="faq-accordion--kyr-v2" defaultOpen="kyr-1" />
          </Reveal>
        </div>
      </section>

      {/* Ask */}
      <section id="ask" className="kyr-ask">
        <div className="container">
          <div className="kyr-ask__panel">
            <Reveal as="div" className="kyr-ask__copy" variant="up">
              <span className="kyr-rule" aria-hidden="true" />
              <h2>Can&apos;t find what you&apos;re looking for?</h2>
              <p>
                Ask us directly. A volunteer reads every message and replies within 24 hours, and your
                question may become our next guide.
              </p>
              <div className="kyr-ask__actions">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="kyr-pill">
                  WhatsApp us
                </a>
                <a href={`tel:+917043031263`} className="kyr-pill kyr-pill--ghost">
                  Call the helpline
                </a>
              </div>
            </Reveal>

            <Reveal as="div" className="kyr-ask__form-wrap" variant="up" delay={60}>
              <form className="kyr-ask__form" onSubmit={onSubmit}>
                <img src={mapImage} alt="" className="kyr-ask__form-map" aria-hidden="true" />
                <label>
                  Your question
                  <textarea
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe your situation in a few lines…"
                    required
                  />
                </label>
                <label>
                  Phone or email for the reply
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+91 or you@email.com"
                    required
                  />
                </label>
                <button type="submit" className="kyr-pill kyr-pill--block">
                  {sent ? 'Opening WhatsApp…' : 'Send question →'}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
