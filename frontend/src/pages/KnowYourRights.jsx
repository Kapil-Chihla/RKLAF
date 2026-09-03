import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import FaqAccordion from '../components/FaqAccordion';
import { WHATSAPP_URL } from '../data/navigation';
import { legalGlossaryByLetter, GLOSSARY_LETTERS } from '../data/legalGlossary';
import { kyrHelplines } from '../data/kyrHelplines';
import { kyrFaqs } from '../data/kyrFaqs';
import mapImage from '../assets/map.webp';
import kyrBanner from '../assets/knowyourrightsbanner.jpeg';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { guidePdfDownloadUrl, guidePdfViewUrl, rightsDeckPdfDownloadUrl, rightsDeckPdfViewUrl } from '../lib/pdfDownload';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import DeckPdfSlide, { useDeckPdfDocument } from '../components/pdf/DeckPdfSlide';
import { looksLikeEmail, submitContact } from '../lib/submitContact';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import './KnowYourRights.css';

const GUIDE_TONES = ['plum', 'cream', 'ink', 'sage', 'gold', 'clay', 'olive'];

const doors = [
  {
    icon: 'book',
    title: 'Legal Glossary',
    tagline: 'START WITH THE LAW. KNOW WHAT IT MEANS.',
    desc: "Legal words shouldn't stand between people and their rights. Find plain language definitions of the terms that appear in FIRs, petitions, court orders and everyday legal processes.",
    cta: 'Browse A to Z →',
    href: '#glossary',
  },
  {
    icon: 'compass',
    title: 'Practical Guides',
    tagline: 'KNOW WHAT TO DO.',
    desc: 'Short, practical guides built around one situation at a time — what your rights are, what steps you can take, what documents you may need, and where to seek help.',
    cta: 'Read a guide →',
    href: '#guides',
  },
  {
    icon: 'film',
    title: 'Explainer Videos',
    tagline: 'SEE THE LAW, EXPLAINED.',
    desc: 'Short, accessible explainers in Hindi and English that break down legal concepts and everyday rights, designed especially for first time readers, community outreach and legal-aid camps.',
    cta: 'Watch now →',
    href: '#videos',
  },
  {
    icon: 'phone',
    title: 'Emergency Contacts',
    tagline: 'KNOW WHERE TO TURN.',
    desc: 'Important helplines and support numbers to keep within reach — from national emergency and assistance services to legal-aid contacts.',
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

const FALLBACK_DECKS = [
  {
    id: 'fallback-deck-1',
    category: 'Senior citizens',
    smallTitle: 'Guide 01 · Senior citizens',
    title: 'Your children cannot throw you out',
    description: 'Maintenance, eviction, and the Senior Citizens Act — what to ask for first.',
    banner: null,
    hasPdf: false,
    downloadHref: '#',
    viewHref: '#',
    slideCount: 5,
  },
  {
    id: 'fallback-deck-2',
    category: 'Police & FIR',
    smallTitle: 'Guide 02 · Reporting a crime',
    title: 'Filing an FIR that actually gets registered',
    description: 'Zero FIR, refusals, and the free copy you must not leave without.',
    banner: null,
    hasPdf: false,
    downloadHref: '#',
    viewHref: '#',
    slideCount: 5,
  },
  {
    id: 'fallback-deck-3',
    category: 'Wages',
    smallTitle: 'Guide 03 · Unpaid wages',
    title: 'Recovering unpaid wages in three steps',
    description: 'Labour commissioner route, documents to carry, and timelines that matter.',
    banner: null,
    hasPdf: false,
    downloadHref: '#',
    viewHref: '#',
    slideCount: 5,
  },
  {
    id: 'fallback-deck-4',
    category: 'Domestic violence',
    smallTitle: 'Guide 04 · DV Act',
    title: 'Protection orders under the DV Act',
    description: 'Relief tonight vs next month — what a magistrate can order.',
    banner: null,
    hasPdf: false,
    downloadHref: '#',
    viewHref: '#',
    slideCount: 5,
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

const emergency = kyrHelplines;

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
  const [deckList, setDeckList] = useState(FALLBACK_DECKS);
  const [activeDeckIdx, setActiveDeckIdx] = useState(0);
  const [deckSlide, setDeckSlide] = useState(0);
  const [videoList, setVideoList] = useState(FALLBACK_VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [glossaryLetter, setGlossaryLetter] = useState('A');
  const glossaryTrackRef = useRef(null);
  const decksScrollRef = useRef(null);
  const deckTabClickRef = useRef(false);

  const glossaryEntries = legalGlossaryByLetter[glossaryLetter] || [];
  const glossaryTotal = Object.values(legalGlossaryByLetter).reduce((n, list) => n + list.length, 0);
  const glossaryPreview = glossaryEntries.map((e) => e.term).join('  ·  ');
  const activeDeck = deckList[activeDeckIdx] || null;

  const {
    pdf: deckPdf,
    numPages: deckPdfPages,
    loading: deckPdfLoading,
    error: deckPdfError,
  } = useDeckPdfDocument(
    activeDeck?.viewHref,
    activeDeck?.downloadHref,
    Boolean(activeDeck?.hasPdf),
  );

  const pdfPageCount = activeDeck?.hasPdf
    ? Math.max(1, deckPdfPages || Number(activeDeck.slideCount) || 1)
    : 0;
  /** Slide 0 = cover banner; slides 1..pdfPageCount = PDF pages (one page each) */
  const deckSlideTotal = pdfPageCount > 0 ? pdfPageCount + 1 : 1;
  const showingPdfSlide = Boolean(activeDeck?.hasPdf && deckSlide > 0);
  const pdfPageNum = showingPdfSlide ? deckSlide : 1;

  useEffect(() => {
    setDeckSlide(0);
  }, [activeDeckIdx, activeDeck?.id]);

  useEffect(() => {
    if (!showingPdfSlide) return;
    setDeckSlide((s) => Math.min(s, deckSlideTotal - 1));
  }, [deckSlideTotal, showingPdfSlide]);

  const scrollGlossary = (dir) => {
    const el = glossaryTrackRef.current;
    if (!el) return;
    const step = Math.max(220, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  useEffect(() => {
    glossaryTrackRef.current?.scrollTo({ left: 0 });
  }, [glossaryLetter]);

  useEffect(() => {
    if (!deckTabClickRef.current) return undefined;
    deckTabClickRef.current = false;
    const scroller = decksScrollRef.current;
    const tab = document.getElementById(`kyr-deck-tab-${activeDeck?.id}`);
    if (!scroller || !tab) return undefined;
    const tabLeft = tab.offsetLeft;
    const tabRight = tabLeft + tab.offsetWidth;
    const viewLeft = scroller.scrollLeft;
    const viewRight = viewLeft + scroller.clientWidth;
    if (tabLeft < viewLeft) {
      scroller.scrollTo({ left: Math.max(0, tabLeft - 12), behavior: 'smooth' });
    } else if (tabRight > viewRight) {
      scroller.scrollTo({ left: tabRight - scroller.clientWidth + 12, behavior: 'smooth' });
    }
    return undefined;
  }, [activeDeckIdx, activeDeck?.id]);

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
      .get('/rights-decks')
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        setDeckList(
          r.data.map((d, i) => ({
            id: d.id || d.slug || `deck-${i}`,
            category: (d.category || '').trim(),
            smallTitle: (d.smallTitle || '').trim(),
            title: d.title,
            description: (d.description || '').trim(),
            banner: d.banner ? assetUrl(d.banner) : null,
            hasPdf: Boolean(d.pdf),
            downloadHref: d.pdf ? rightsDeckPdfDownloadUrl(d.id) : '#',
            viewHref: d.pdf ? rightsDeckPdfViewUrl(d.id) : '#',
            slideCount: d.slideCount || null,
          })),
        );
        setActiveDeckIdx(0);
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
      setAskError(err.response?.data?.message || 'Could not send. Please WhatsApp us instead.');
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
            <h1 className="kyr-hero__title">
              <span>Know the Law.</span>
              <span>Know Your Rights.</span>
              <span>
                Know Your <em>Next Step</em>
              </span>
            </h1>
            <p className="kyr-hero__lead">
              “A right can only be exercised when it is known.” Legal awareness should not begin after a
              problem has become a crisis. Know Your Rights is RKLAF&apos;s effort to make the law easier to
              understand, easier to access, and easier to use — so people can recognise when their rights are
              being affected, and know what steps they can take.
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
            <h2>Law, Without the Legalese.</h2>
          </Reveal>

          <div className="kyr-doors__grid">
            {doors.map((d, i) => (
              <Reveal key={d.title} as="article" className="kyr-door" variant="up" delay={i * 50}>
                <span className="kyr-door__icon">
                  <DoorIcon name={d.icon} />
                </span>
                <p className="kyr-door__title">{d.title}</p>
                <h3 className="kyr-door__tagline">{d.tagline}</h3>
                <p className="kyr-door__desc">{d.desc}</p>
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
            <h2 className="kyr-section-tagline">START WITH THE LAW. KNOW WHAT IT MEANS.</h2>
            <p className="kyr-glossary__lede">
              Legal words shouldn&apos;t stand between people and their rights. Find plain language definitions
              of the terms that appear in FIRs, petitions, court orders and everyday legal processes. This
              glossary explains them in plain language and in their practical legal context. Pick a letter to
              begin.
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
              <div className="kyr-az__toolbar">
                <p className="kyr-az__hint">
                  {glossaryEntries.length > 3
                    ? `Swipe or use arrows — ${glossaryEntries.length} terms`
                    : 'Glossary terms'}
                </p>
                <div className="kyr-az__arrows">
                  <button
                    type="button"
                    className="kyr-az__arrow"
                    aria-label="Scroll glossary left"
                    onClick={() => scrollGlossary(-1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="kyr-az__arrow"
                    aria-label="Scroll glossary right"
                    onClick={() => scrollGlossary(1)}
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="kyr-az__scroller">
                <dl
                  ref={glossaryTrackRef}
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
                {glossaryEntries.length > 3 ? (
                  <div className="kyr-az__fade" aria-hidden="true" />
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="guides" className="kyr-guides">
        <div className="container">
          <Reveal as="header" className="kyr-guides__head" variant="up">
            <p className="kyr-label">Practical Guides</p>
            <h2>When you need to know what to do.</h2>
            <p>
              Each guide takes one legal situation at a time and turns it into clear, practical steps — what
              you need to know, what you can do, and where to seek help. Explore a guide to preview and
              download the PDF.
            </p>
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
                <h3 className="kyr-pdf__title" title={displayText(g.title)}>
                  {canPreview ? (
                    <button type="button" className="kyr-pdf__title-btn" onClick={() => setActiveGuide(g)}>
                      {displayText(g.title)}
                    </button>
                  ) : (
                    displayText(g.title)
                  )}
                </h3>
                {g.description ? <p className="kyr-pdf__desc">{renderRichText(g.description)}</p> : null}
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

      {deckList.length > 0 ? (
        <section id="decks" className="kyr-decks">
          <div className="container">
            <Reveal as="header" className="kyr-center-head" variant="up">
              <p className="kyr-label">Practical guides, made visual</p>
              <h2>The law, in a format you can see and share.</h2>
              <p className="kyr-decks__intro">
                Our practical legal guides are also available as short, visual slide decks, designed to make
                legal information easier to follow, present and share at legal aid camps, community sessions,
                classrooms or before a hearing. Pick a guide below to preview and download the PDF.
              </p>
            </Reveal>

            <div
              ref={decksScrollRef}
              className="kyr-decks__scroll"
              role="tablist"
              aria-label="Know Your Rights guide decks"
            >
              <div className="kyr-decks__track">
                {deckList.map((deck, i) => {
                  const n = String(i + 1).padStart(2, '0');
                  const selected = i === activeDeckIdx;
                  return (
                    <div key={deck.id} className="kyr-deck-slot">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="kyr-deck-panel"
                        id={`kyr-deck-tab-${deck.id}`}
                        className={`kyr-deck-card${selected ? ' is-active' : ''}${deck.banner ? ' has-photo' : ''}`}
                        style={
                          deck.banner
                            ? { backgroundImage: `url(${deck.banner})` }
                            : undefined
                        }
                        onClick={() => {
                          deckTabClickRef.current = true;
                          setActiveDeckIdx(i);
                        }}
                      >
                        <span className="kyr-deck-card__veil" aria-hidden="true" />
                        <span className="kyr-deck-card__cat">
                          {deck.category || deck.smallTitle || 'Know your rights'}
                        </span>
                        <span className="kyr-deck-card__title">{displayText(deck.title)}</span>
                        <span className="kyr-deck-card__num" aria-hidden="true">
                          {n}
                        </span>
                        <span className="kyr-deck-card__arc" aria-hidden="true" />
                      </button>
                      <div className="kyr-deck-card__meta">
                        <span className="kyr-deck-card__meta-title">{displayText(deck.title)}</span>
                        {deck.slideCount ? (
                          <span className="kyr-deck-card__slides">{deck.slideCount} slides</span>
                        ) : (
                          <span className="kyr-deck-card__slides">PDF</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeDeck ? (
              <div
                id="kyr-deck-panel"
                role="tabpanel"
                aria-labelledby={`kyr-deck-tab-${activeDeck.id}`}
                className="kyr-deck-stage"
              >
                {showingPdfSlide ? (
                  <div className="kyr-deck-stage__pdf">
                    {deckPdfLoading ? (
                      <p className="kyr-deck-stage__pdf-status">Loading slides…</p>
                    ) : deckPdfError || !deckPdf ? (
                      <div className="kyr-deck-stage__pdf-status kyr-deck-stage__pdf-status--error">
                        <p>{deckPdfError || 'PDF could not be loaded.'}</p>
                        {activeDeck.hasPdf ? (
                          <a href={activeDeck.downloadHref} target="_blank" rel="noopener noreferrer">
                            Download deck instead →
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <DeckPdfSlide
                        pdf={deckPdf}
                        pageNumber={pdfPageNum}
                        title={`${activeDeck.title} — page ${pdfPageNum}`}
                      />
                    )}
                    <span className="kyr-deck-stage__count" aria-hidden="true">
                      {pdfPageNum} / {pdfPageCount}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`kyr-deck-stage__banner${activeDeck.banner ? ' has-photo' : ''}`}
                    style={
                      activeDeck.banner
                        ? { backgroundImage: `url(${activeDeck.banner})` }
                        : undefined
                    }
                  >
                    <div className="kyr-deck-stage__veil" aria-hidden="true" />
                    <p className="kyr-deck-stage__brand">Know your rights · RKLAF</p>
                    <div className="kyr-deck-stage__copy">
                      {activeDeck.smallTitle ? (
                        <p className="kyr-deck-stage__small">{displayText(activeDeck.smallTitle)}</p>
                      ) : activeDeck.category ? (
                        <p className="kyr-deck-stage__small">{displayText(activeDeck.category)}</p>
                      ) : null}
                      <h3 className="kyr-deck-stage__title">{displayText(activeDeck.title)}</h3>
                      {activeDeck.description ? (
                        <p className="kyr-deck-stage__desc">{renderRichText(activeDeck.description)}</p>
                      ) : null}
                    </div>
                    <span className="kyr-deck-stage__arc" aria-hidden="true" />
                    <span className="kyr-deck-stage__count" aria-hidden="true">
                      {showingPdfSlide
                        ? `${pdfPageNum} / ${pdfPageCount}`
                        : pdfPageCount
                          ? `Cover · ${pdfPageCount} slides`
                          : '01'}
                    </span>
                  </div>
                )}

                <div className="kyr-deck-stage__bar">
                  <div className="kyr-deck-stage__dots" aria-hidden="true">
                    {Array.from({ length: deckSlideTotal }, (_, i) => (
                      <button
                        key={`slide-dot-${i}`}
                        type="button"
                        className={`kyr-deck-stage__dot${i === deckSlide ? ' is-on' : ''}`}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => setDeckSlide(i)}
                      />
                    ))}
                  </div>
                  <p className="kyr-deck-stage__bar-label">
                    {showingPdfSlide
                      ? `Page ${pdfPageNum} of ${pdfPageCount}`
                      : activeDeck.category || activeDeck.smallTitle || 'Know your rights'}
                  </p>
                  <div className="kyr-deck-stage__nav">
                    <button
                      type="button"
                      className="kyr-deck-stage__arrow"
                      aria-label="Previous slide"
                      disabled={deckSlide <= 0}
                      onClick={() => setDeckSlide((s) => Math.max(0, s - 1))}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="kyr-deck-stage__arrow"
                      aria-label="Next slide"
                      disabled={deckSlide >= deckSlideTotal - 1}
                      onClick={() => setDeckSlide((s) => Math.min(deckSlideTotal - 1, s + 1))}
                    >
                      →
                    </button>
                    {activeDeck.hasPdf ? (
                      <a
                        className="kyr-deck-stage__dl"
                        href={activeDeck.downloadHref}
                        download
                      >
                        Download deck ↓
                      </a>
                    ) : (
                      <span className="kyr-deck-stage__dl kyr-deck-stage__dl--disabled">
                        PDF coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section id="videos" className="kyr-videos">
        <div className="container">
          <Reveal as="header" className="kyr-center-head" variant="up">
            <p className="kyr-label">Explainer Videos</p>
            <h2>The law, explained simply.</h2>
            <p className="kyr-center-head__lede">
              Short Hindi and English videos that break down legal rights, concepts and everyday situations
              into clear, easy to understand explanations. Watch an explainer and understand the law in
              minutes.
            </p>
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
                      <h3>{displayText(v.title)}</h3>
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
          <Reveal as="header" className="kyr-emergency__head" variant="up">
            <p className="kyr-label kyr-label--on-dark">Emergency contacts</p>
            <h2 className="kyr-section-tagline kyr-section-tagline--on-dark">KNOW WHERE TO TURN.</h2>
            <p className="kyr-emergency__lede">
              Important helplines and support numbers to keep within reach — from national emergency and
              assistance services to legal-aid contacts.
            </p>
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
              <h2>Still have a question?</h2>
              <p>
                Ask us. We&apos;ll help you find your way forward. If you cannot find what you are looking for,
                reach out to us directly. Our team reviews your questions and helps point you towards the
                information or assistance you may need. Your question could become someone else&apos;s answer.
              </p>
              <div className="kyr-ask__actions">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="kyr-pill">
                  WhatsApp us
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
