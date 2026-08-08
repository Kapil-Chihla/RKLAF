import { useEffect, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import FaqAccordion from '../components/FaqAccordion';
import { WHATSAPP_DISPLAY, WHATSAPP_URL, CONTACT_PHONE_TEL } from '../data/navigation';
import { legalGlossaryByLetter, GLOSSARY_LETTERS } from '../data/legalGlossary';
import { kyrHelplines } from '../data/kyrHelplines';
import { kyrFaqs } from '../data/kyrFaqs';
import mapImage from '../assets/map.webp';
import kyrBanner from '../assets/knowyourrightsbanner.jpeg';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { guidePdfDownloadUrl, guidePdfViewUrl } from '../lib/pdfDownload';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import { looksLikeEmail, submitContact } from '../lib/submitContact';
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

const FALLBACK_VIDEOS = [
  {
    id: 'fallback-1',
    title: 'The Senior Citizens Act in 8 minutes',
    meta: '24K views · Hindi & English subtitles',
    thumbnail: null,
    video: null,
    externalUrl: null,
  },
  {
    id: 'fallback-2',
    title: 'Your first day in court',
    meta: '90 sec animated short',
    thumbnail: null,
    video: null,
    externalUrl: null,
  },
  {
    id: 'fallback-3',
    title: 'Reading a gift deed before signing',
    meta: '2 min · from our camps',
    thumbnail: null,
    video: null,
    externalUrl: null,
  },
];

/** Turn YouTube / Vimeo watch URLs into embeddable iframe srcs. */
function embedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const id = u.searchParams.get('v') || u.pathname.match(/\/embed\/([^/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

const emergency = [
  {
    number: WHATSAPP_DISPLAY.replace(/\s/g, ''),
    label: 'RKLAF free legal helpline · Mon to Sat, 9 to 6',
    href: CONTACT_PHONE_TEL,
    featured: true,
  },
  ...kyrHelplines,
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
  const [askBusy, setAskBusy] = useState(false);
  const [askError, setAskError] = useState('');
  const [guideList, setGuideList] = useState(guides);
  const [activeGuide, setActiveGuide] = useState(null);
  const [videoList, setVideoList] = useState(FALLBACK_VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [glossaryLetter, setGlossaryLetter] = useState('A');

  const glossaryEntries = legalGlossaryByLetter[glossaryLetter] || [];
  const glossaryTotal = Object.values(legalGlossaryByLetter).reduce((n, list) => n + list.length, 0);
  const glossaryPreview = glossaryEntries.map((e) => e.term).join('  ·  ');

  useEffect(() => {
    publicApi
      .get('/articles')
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        setGuideList(
          r.data.map((a, i) => ({
            id: a.id || a.slug || `guide-${i}`,
            title: a.title,
            description: (a.summary || '').trim(),
            coverLabel: a.category || 'Practical guide',
            tone: GUIDE_TONES[i % GUIDE_TONES.length],
            href: a.file ? guidePdfDownloadUrl(a.id) : '#',
            viewHref: a.file ? guidePdfViewUrl(a.id) : '#',
            coverImage: a.coverImage ? assetUrl(a.coverImage) : null,
            hasPdf: Boolean(a.file),
          })),
        );
      })
      .catch(() => {});

    publicApi
      .get('/explainer-videos')
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        setVideoList(
          r.data.map((v, i) => ({
            id: v.id || v.slug || `video-${i}`,
            title: v.title,
            meta: v.meta || '',
            thumbnail: v.thumbnail ? assetUrl(v.thumbnail) : null,
            video: v.video ? assetUrl(v.video) : null,
            externalUrl: v.externalUrl || null,
          })),
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeVideo) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [activeVideo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setAskError('');
    setAskBusy(true);
    const reach = contact.trim();
    try {
      await submitContact({
        name: 'Know Your Rights visitor',
        email: looksLikeEmail(reach) ? reach : '',
        phone: looksLikeEmail(reach) ? '' : reach,
        message: question.trim(),
        source: 'know-your-rights',
        subject: '[RKLAF] Know Your Rights — question',
      });
      setSent(true);
      setQuestion('');
      setContact('');
    } catch (err) {
      setAskError(err.response?.data?.message || 'Could not send. Please WhatsApp or call the helpline.');
    } finally {
      setAskBusy(false);
    }
  };

  const openVideo = (v) => {
    if (!v.video && !v.externalUrl) return;
    setActiveVideo(v);
  };

  const iframeSrc = activeVideo ? embedUrl(activeVideo.externalUrl) : null;
  const fileSrc = activeVideo?.video || null;

  return (
    <div className="kyr kyr--v2">
      {/* Hero — knowyourrightsbanner.jpeg */}
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
            <div className="kyr-hero__actions">
              <a href="#glossary" className="kyr-pill">
                Open the glossary
              </a>
              <a href="#ask" className="kyr-pill kyr-pill--ghost">
                <span className="kyr-pill__dot" aria-hidden="true" />
                Get free legal aid
              </a>
            </div>
          </Reveal>

          <Reveal as="div" className="kyr-hero__visual" variant="scale" delay={80}>
            <div className="kyr-banner" aria-hidden="true">
              <img src={kyrBanner} alt="" className="kyr-banner__img" />
            </div>
          </Reveal>
        </div>
      </header>

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

      <section id="glossary" className="kyr-glossary">
        <div className="kyr-glossary__wash" aria-hidden="true" />
        <div className="container kyr-glossary__inner">
          <Reveal as="header" className="kyr-glossary__head" variant="up">
            <p className="kyr-label">Legal glossary</p>
            <h2>Words that stop scaring you once you know them</h2>
            <p className="kyr-glossary__lede">
              Pick a letter. Every term is explained in one line, in the sense it is actually used at a
              police station or in court.
            </p>
          </Reveal>

          <Reveal as="div" className="kyr-glossbar-wrap" variant="up" delay={40}>
            <div className="kyr-glossbar" aria-label={`Terms under ${glossaryLetter}`}>
              <div className="kyr-glossbar__letter" aria-live="polite">
                <span>{glossaryLetter}</span>
              </div>
              <p className="kyr-glossbar__terms" title={glossaryPreview}>
                {glossaryPreview || 'No terms for this letter yet.'}
              </p>
            </div>

            <a href="#glossary-panel" className="kyr-glossary__viewall">
              View all {glossaryTotal}+ terms →
            </a>

            <div className="kyr-glossbar__az" role="tablist" aria-label="A to Z">
              {GLOSSARY_LETTERS.map((letter) => {
                const count = legalGlossaryByLetter[letter]?.length || 0;
                const disabled = count === 0;
                return (
                  <button
                    key={letter}
                    type="button"
                    role="tab"
                    aria-selected={glossaryLetter === letter}
                    aria-controls="glossary-panel"
                    disabled={disabled}
                    className={`kyr-glossbar__tab ${glossaryLetter === letter ? 'is-active' : ''}`}
                    onClick={() => setGlossaryLetter(letter)}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            <div id="glossary-panel" className="kyr-az__panel" role="tabpanel">
              <dl
                className="kyr-az__track"
                key={glossaryLetter}
                aria-label={`Definitions for letter ${glossaryLetter}`}
              >
                {glossaryEntries.length ? (
                  glossaryEntries.map((entry) => (
                    <div key={entry.term} className="kyr-az__card">
                      <dt>{entry.term}</dt>
                      <dd>{entry.def}</dd>
                    </div>
                  ))
                ) : (
                  <div className="kyr-az__card kyr-az__card--empty">
                    <dt>No terms yet</dt>
                    <dd>Pick another letter from the row above.</dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="guides" className="kyr-guides">
        <div className="container">
          <Reveal as="header" className="kyr-guides__head" variant="up">
            <span className="kyr-rule" aria-hidden="true" />
            <h2>Practical guides, one situation at a time</h2>
            <p>Open any handbook to preview, zoom, and download the PDF.</p>
          </Reveal>

          <div className="kyr-guides__cards">
            {guideList.map((g, i) => {
              const canPreview =
                g.hasPdf !== false &&
                ((g.href && g.href !== '#') || (g.viewHref && g.viewHref !== '#'));
              return (
              <Reveal key={g.id} as="article" className="kyr-pdf" variant="up" delay={i * 40}>
                <button
                  type="button"
                  className={`kyr-pdf__cover kyr-pdf__cover--${g.tone}${g.coverImage ? ' kyr-pdf__cover--photo' : ''}${canPreview ? ' kyr-pdf__cover--clickable' : ''}`}
                  style={
                    g.coverImage
                      ? {
                          backgroundImage: `url(${g.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                  onClick={() => {
                    if (canPreview) setActiveGuide(g);
                  }}
                  disabled={!canPreview}
                  aria-label={canPreview ? `Preview ${g.title}` : `${g.title} PDF coming soon`}
                >
                  <span className="kyr-pdf__badge">PDF</span>
                  {!g.coverImage ? <strong>{g.coverLabel || g.cover}</strong> : null}
                </button>
                <h3 className="kyr-pdf__title" title={g.title}>
                  {canPreview ? (
                    <button type="button" className="kyr-pdf__title-btn" onClick={() => setActiveGuide(g)}>
                      {g.title}
                    </button>
                  ) : (
                    g.title
                  )}
                </h3>
                {g.description ? <p className="kyr-pdf__desc">{g.description}</p> : null}
                {canPreview ? (
                  <div className="kyr-pdf__actions">
                    <button
                      type="button"
                      className="kyr-pdf__dl"
                      onClick={() => setActiveGuide(g)}
                      aria-label={`Preview ${g.title}`}
                    >
                      Preview
                    </button>
                    <a
                      className="kyr-pdf__dl kyr-pdf__dl--secondary"
                      href={g.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${g.title} as PDF`}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 4v10M8 10l4 4 4-4" />
                        <path d="M5 18h14" />
                      </svg>
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="kyr-pdf__dl kyr-pdf__dl--disabled" aria-disabled="true">
                    PDF coming soon
                  </span>
                )}
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {activeGuide ? (
        <PdfPreviewModal
          title={activeGuide.title}
          viewUrl={activeGuide.viewHref}
          downloadUrl={activeGuide.href}
          onClose={() => setActiveGuide(null)}
        />
      ) : null}

      <section id="videos" className="kyr-videos">
        <div className="container">
          <Reveal as="header" className="kyr-center-head" variant="up">
            <p className="kyr-label">Explainer videos</p>
            <h2>Watch it in two minutes</h2>
          </Reveal>

          <div className="kyr-videos__scroll" role="region" aria-label="Explainer videos carousel">
            <div className="kyr-videos__track">
              {videoList.map((v, i) => {
                const playable = Boolean(v.video || v.externalUrl);
                return (
                  <Reveal key={v.id} as="article" className="kyr-video" variant="up" delay={Math.min(i * 40, 160)}>
                    <button
                      type="button"
                      className="kyr-video__thumb"
                      aria-label={playable ? `Play: ${v.title}` : v.title}
                      disabled={!playable}
                      onClick={() => openVideo(v)}
                    >
                      {v.thumbnail ? (
                        <img src={v.thumbnail} alt="" className="kyr-video__img" loading="lazy" />
                      ) : (
                        <span className="kyr-video__ph">Video thumbnail</span>
                      )}
                      <span className="kyr-video__play" aria-hidden="true">
                        ▶
                      </span>
                    </button>
                    <div className="kyr-video__meta">
                      <h3>{v.title}</h3>
                      {v.meta ? <p>{v.meta}</p> : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {activeVideo ? (
        <div
          className="kyr-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div className="kyr-video-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="kyr-video-modal__close"
              aria-label="Close video"
              onClick={() => setActiveVideo(null)}
            >
              ×
            </button>
            <div className="kyr-video-modal__frame">
              {fileSrc ? (
                <video src={fileSrc} controls autoPlay playsInline />
              ) : iframeSrc ? (
                <iframe
                  src={iframeSrc}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.externalUrl ? (
                <a
                  className="kyr-video-modal__ext"
                  href={activeVideo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open video in a new tab →
                </a>
              ) : null}
            </div>
            <p className="kyr-video-modal__title">{activeVideo.title}</p>
          </div>
        </div>
      ) : null}

      <section id="emergency" className="kyr-emergency">
        <div className="container">
          <Reveal as="header" variant="up">
            <p className="kyr-label kyr-label--on-dark">Emergency contacts</p>
            <h2>Save these before you need them</h2>
          </Reveal>

          <div className="kyr-emergency__grid">
            {emergency.map((c, i) => (
              <Reveal key={`${c.number}-${c.label}`} as="div" variant="up" delay={Math.min(i * 25, 200)}>
                <a
                  href={c.href}
                  className={`kyr-emcard ${c.featured ? 'kyr-emcard--featured' : ''}`}
                >
                  <strong>{c.number}</strong>
                  <span>{c.label}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
                <a href={CONTACT_PHONE_TEL} className="kyr-pill kyr-pill--ghost">
                  Call the helpline
                </a>
              </div>
            </Reveal>

            <Reveal as="div" className="kyr-ask__form-wrap" variant="up" delay={60}>
              <form className="kyr-ask__form" onSubmit={onSubmit}>
                <img src={mapImage} alt="" className="kyr-ask__form-map" aria-hidden="true" />
                {askError ? (
                  <p className="kyr-ask__status kyr-ask__status--error" role="alert">
                    {askError}
                  </p>
                ) : null}
                {sent && !askError ? (
                  <p className="kyr-ask__status kyr-ask__status--ok" role="status">
                    Sent — a volunteer will reply within 24 hours.
                  </p>
                ) : null}
                <label>
                  Your question
                  <textarea
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe your situation in a few lines…"
                    required
                    disabled={askBusy}
                  />
                </label>
                <label>
                  Email or phone
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="How should we reach you?"
                    required
                    disabled={askBusy}
                  />
                </label>
                <button type="submit" className="kyr-pill kyr-pill--block" disabled={askBusy}>
                  {askBusy ? 'Sending…' : sent ? 'Send another question' : 'Send question'}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
