import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { reportPdfDownloadUrl } from '../lib/pdfDownload';
import './OurWork.css';

export const FALLBACK_DESK = [
  {
    id: 'fallback-1',
    slug: 'built-from-one-wave-of-evictions',
    number: 1,
    kicker: 'Senior Citizens',
    title: 'Built from one wave of evictions',
    listingDescription:
      'In 2018 our helpline began ringing with the same story told in different voices: parents moved into storerooms of houses they built, gift deeds signed under pressure, patience mistaken for consent. The desk was built to answer that exact call, and it has never stopped.\n\nA single case officer stays with each elder from intake to compliance. Volunteers sit beside them at every hearing, so nobody faces a tribunal alone at seventy.',
    heroImage: null,
    fullHeader: 'Four hundred elders, one method',
    fullBody:
      'How the Senior Citizens Protection Desk works — from the first helpline call to the order that restores a home, and the volunteer who sits through every hearing.\n\nEach matter begins on the helpline. A case officer opens a file, gathers the deed papers, and stays with the elder through every tribunal date. Volunteers sit beside them so nobody faces the bench alone.\n\nOrders are followed through to compliance: possession restored, gift deeds cancelled, maintenance paid. That method — one officer, one volunteer, one file — is how four hundred elders have been protected since the desk opened.',
    gallery: [],
  },
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
    href: '#full-account',
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
        <a href={item.href} className="work-prog__more">Learn more ↓</a>
      </div>
      <div className={`work-prog__num work-prog__num--${item.stripe}`} aria-hidden="true">
        {item.num}
      </div>
    </article>
  );
}

function deskStoryHref(story) {
  const slug =
    story.slug ||
    String(story.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return slug ? `/our-work/desk/${slug}` : null;
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
      {/* Banner */}
      <header className="work-banner">
        <div className="work-banner__ph" aria-hidden="true">
          <span>Banner photo · Legal aid camp under way, wide shot</span>
        </div>
        <div className="container work-banner__inner">
          <h1>Our Work</h1>
        </div>
      </header>

      {/* Programmes */}
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

      {/* Spotlights intro */}
      <div className="container">
        <p className="work-section-label work-section-label--spot">
          <span className="work-section-label__rule" aria-hidden="true" />
          Project spotlights
        </p>
      </div>

      {/* The Desk */}
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

      {/* The Camps */}
      <section id="camps" className="work-camps">
        <div className="work-camps__overlay" aria-hidden="true" />
        <div className="work-camps__inner">
          <p className="work-camps__label">Project 02 · Mobile Camps</p>
          <h2 className="work-camps__title">The Camps</h2>
          <p className="work-camps__ph">Full-bleed photo · Camp under a banyan tree, dusk</p>
          <a href="#programmes" className="work-pill work-pill--light">Full story →</a>
        </div>
      </section>

      {/* Annual reports */}
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
