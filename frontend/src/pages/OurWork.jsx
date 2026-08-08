import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { reportPdfDownloadUrl } from '../lib/pdfDownload';
import { FALLBACK_DESK, deskStoryHref } from '../data/deskStories';
import './OurWork.css';

const WORK_BROWSE = [
  { id: 'programmes', num: '01', label: 'Programmes & Initiatives' },
  { id: 'desk', num: '02', label: 'Our Desk' },
  { id: 'reports', num: '03', label: 'Annual Reports' },
];

const FALLBACK_REPORTS = [
  { id: 'fb-r1', year: '2025–26', title: 'Annual Report 2025–26', summary: 'Impact, audited financials & ledger', file: null },
  { id: 'fb-r2', year: '2024–25', title: 'Annual Report 2024–25', summary: 'Impact, audited financials & ledger', file: null },
];

const programmes = [
  {
    num: '01',
    stripe: 'brown',
    meta: 'Flagship · Since 2018',
    title: 'Senior Citizens Protection Desk',
    desc: 'Maintenance petitions, Section 23 cancellations of coerced property transfers, and tribunal representation with a volunteer at every hearing.',
    stats: [
      { value: '400+', label: 'elders protected' },
      { value: '47', label: 'days to first order' },
      { value: '94%', label: 'orders complied with' },
    ],
    href: '#desk',
    flip: false,
  },
  {
    num: '02',
    stripe: 'brown',
    meta: 'Outreach · Weekends',
    title: 'Mobile Legal Aid Camps',
    desc: 'Camps in villages and urban settlements: on-the-spot advice, same-day drafting and case registration, routed by helpline demand.',
    stats: [
      { value: '40+', label: 'camps held' },
      { value: '3,100+', label: 'people engaged' },
      { value: '9', label: 'districts this year' },
    ],
    href: '#camps',
    flip: true,
  },
  {
    num: '03',
    stripe: 'brown',
    meta: 'Education · Ongoing',
    title: 'Digital Legal Literacy Hub',
    desc: 'Plain-language rights modules, infographics and short videos in Hindi and English, with large print and audio versions for senior citizens.',
    stats: [
      { value: '24', label: 'modules' },
      { value: '12', label: 'partner law schools' },
      { value: '2', label: 'languages' },
    ],
    href: '/know-your-rights',
    flip: false,
  },
  {
    num: '04',
    stripe: 'olive',
    meta: 'National · Student-led',
    title: 'RTI & NRI Guidance Drives',
    desc: 'Student-led RTI drives that unlock pensions and entitlements, plus a remote desk guiding overseas Indians through matters back home.',
    stats: [
      { value: '80+', label: 'students' },
      { value: '300+', label: 'RTIs filed' },
      { value: '11', label: 'countries served' },
    ],
    href: '#reports',
    flip: true,
  },
];

function ProgrammeBlock({ item }) {
  const isRoute = item.href?.startsWith('/') && !item.href.includes('#');
  const More = isRoute ? Link : 'a';
  const moreProps = isRoute ? { to: item.href } : { href: item.href };

  return (
    <article className={`work-prog ${item.flip ? 'work-prog--flip' : ''}`} id={`prog-${item.num}`}>
      <div className="work-prog__copy">
        <p className="work-prog__meta">{item.meta}</p>
        <h3 className="work-prog__title">{item.title}</h3>
        <p className="work-prog__desc">{item.desc}</p>
        <div className="work-prog__stats">
          {item.stats.map((s) => (
            <div key={s.label} className="work-prog__stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <More {...moreProps} className="work-prog__more">
          Learn more {isRoute ? '→' : '↓'}
        </More>
      </div>
      <div className={`work-prog__num work-prog__num--${item.stripe}`} aria-hidden="true">
        {item.num}
      </div>
    </article>
  );
}

function DeskEntry({ story, index }) {
  const num = String(story.number || index + 1).padStart(2, '0');
  const paras = (story.listingDescription || '')
    .split(/\n+/)
    .filter((p) => p.trim());
  const hero = story.heroImage ? assetUrl(story.heroImage) : null;
  const detail = story.gallery?.[0];
  const flip = index % 2 === 1;
  const storyHref = deskStoryHref(story);
  const accountLead =
    story.fullBody?.split(/\n+/)[0]?.trim() ||
    'Open the full account — photos, timeline, and the complete story from the desk.';

  return (
    <Reveal as="div" className={`work-desk__entry ${flip ? 'work-desk__entry--flip' : ''}`} variant="up">
      <div className="container work-desk__body">
        <div className="work-desk__copy">
          <div className="work-desk__lead">
            <span className="work-desk__num" aria-hidden="true">
              {num}
            </span>
            <div className="work-desk__lead-text">
              <p className="work-desk__kicker">{story.kicker || 'The Desk'}</p>
              <h3>{story.title}</h3>
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="work-desk__photos">
          <figure className="work-frame work-frame--lg">
            {hero ? (
              <img className="work-frame__img" src={hero} alt="" />
            ) : (
              <div className="work-frame__ph">
                <span>Photo · {story.title}</span>
              </div>
            )}
          </figure>
          {detail ? (
            <figure className="work-frame work-frame--sm">
              <img className="work-frame__img" src={assetUrl(detail.url)} alt={detail.caption || ''} />
            </figure>
          ) : null}
        </div>
      </div>

      <div className="container work-account__inner work-desk__account">
        <p className="work-account__label">The full account</p>
        <h2 className="work-account__title">{story.fullHeader || story.title}</h2>
        <p className="work-account__lead">{accountLead}</p>
        {storyHref ? (
          <Link to={storyHref} className="work-pill">
            Full story →
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}

export default function OurWork() {
  const [deskStories, setDeskStories] = useState(FALLBACK_DESK);
  const [annualReports, setAnnualReports] = useState(FALLBACK_REPORTS);
  const [activeBrowse, setActiveBrowse] = useState(WORK_BROWSE[0].id);

  useEffect(() => {
    publicApi
      .get('/desk-stories')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setDeskStories(r.data);
      })
      .catch(() => {});
    publicApi
      .get('/reports')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setAnnualReports(r.data.slice(0, 2));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const nodes = WORK_BROWSE.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveBrowse(visible[0].target.id);
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.08, 0.2, 0.4] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [deskStories.length]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveBrowse(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const featured = deskStories[0];
  const bannerStyle = featured?.heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(26,21,16,0.55), rgba(26,21,16,0.78)), url(${assetUrl(featured.heroImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div className="work work--v2">
      <header className="work-banner">
        <div className="work-banner__ph" aria-hidden="true">
          <span>Banner photo · Legal aid camp under way, wide shot</span>
        </div>
        <div className="container work-banner__inner">
          <h1>Our Work</h1>
        </div>
      </header>

      <nav className="work-browse" aria-label="Browse Our Work">
        <div className="container work-browse__inner">
          {WORK_BROWSE.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`work-browse__tab${activeBrowse === tab.id ? ' is-active' : ''}`}
              onClick={() => scrollToSection(tab.id)}
              aria-current={activeBrowse === tab.id ? 'true' : undefined}
            >
              <span className="work-browse__num">{tab.num}</span>
              <span className="work-browse__label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <section id="programmes" className="work-programmes">
        <div className="container">
          <Reveal as="p" className="work-section-label" variant="up">
            <span className="work-section-label__rule" aria-hidden="true" />
            Programmes &amp; Initiatives
          </Reveal>

          <div className="work-programmes__list">
            {programmes.map((item, i) => (
              <Reveal key={item.num} as="div" variant="up" delay={i * 40}>
                <ProgrammeBlock item={item} />
                {i < programmes.length - 1 ? <hr className="work-divider" /> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <p className="work-section-label work-section-label--spot">
          <span className="work-section-label__rule" aria-hidden="true" />
          Project spotlights
        </p>
      </div>

      <section id="desk" className="work-desk">
        <div className="work-desk__banner" style={bannerStyle}>
          <div className="work-desk__banner-inner">
            <h2 className="work-desk__title">The Desk</h2>
            {!featured?.heroImage ? (
              <p className="work-desk__ph">
                Full-bleed photo · Elderly couple at the tribunal steps, cinematic wide
              </p>
            ) : null}
            <p className="work-desk__sub">
              <span aria-hidden="true">—</span>{' '}
              {featured?.kicker || 'Senior Citizens'} · Project{' '}
              {String(featured?.number || 1).padStart(2, '0')} <span aria-hidden="true">—</span>
            </p>
            <span className="work-desk__star" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>

        {deskStories.map((story, i) => (
          <DeskEntry key={story.id || story.slug || i} story={story} index={i} />
        ))}
      </section>

      <section id="camps" className="work-camps">
        <div className="work-camps__overlay" aria-hidden="true" />
        <div className="work-camps__inner">
          <p className="work-camps__label">Project 02 · Mobile Camps</p>
          <h2 className="work-camps__title">The Camps</h2>
          <p className="work-camps__ph">Full-bleed photo · Camp under a banyan tree, dusk</p>
          <a href="#programmes" className="work-pill work-pill--light">
            Full story →
          </a>
        </div>
      </section>

      <section id="reports" className="work-reports">
        <div className="container">
          <p className="work-section-label">
            <span className="work-section-label__rule" aria-hidden="true" />
            Annual reports
          </p>

          <div className="work-reports__grid">
            {annualReports.map((r) => {
              const hasPdf = Boolean(r.file);
              return (
                <article className="work-report" key={r.id || r.year}>
                  <span className="work-report__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 3h8l4 4v14H7V3z" />
                      <path d="M15 3v4h4M9 12h6M9 16h4" />
                    </svg>
                  </span>
                  <div className="work-report__text">
                    <h3>{r.title || `Annual Report ${r.year}`}</h3>
                    <p>{r.summary || r.label || 'Impact, audited financials & ledger'}</p>
                  </div>
                  {hasPdf ? (
                    <a
                      href={reportPdfDownloadUrl(r.id)}
                      className="work-report__pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pdf ↓
                    </a>
                  ) : (
                    <span className="work-report__pdf work-report__pdf--muted">Pdf ↓</span>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
