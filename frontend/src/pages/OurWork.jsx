import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { reportPdfDownloadUrl } from '../lib/pdfDownload';
import './OurWork.css';

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
    href: '/desk',
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
  const isRoute = item.href?.startsWith('/');
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

export default function OurWork() {
  const [annualReports, setAnnualReports] = useState(FALLBACK_REPORTS);
  const [deskCount, setDeskCount] = useState(0);

  useEffect(() => {
    publicApi
      .get('/reports')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setAnnualReports(r.data.slice(0, 2));
      })
      .catch(() => {});
    publicApi
      .get('/desk-stories')
      .then((r) => {
        if (Array.isArray(r.data)) setDeskCount(r.data.length);
      })
      .catch(() => {});
  }, []);

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

      {/* Desk teaser — full desk lives on /desk */}
      <section id="desk" className="work-desk-teaser">
        <div className="container work-desk-teaser__inner">
          <Reveal as="div" variant="up">
            <p className="work-section-label">
              <span className="work-section-label__rule" aria-hidden="true" />
              Project spotlights
            </p>
            <h2>The Desk</h2>
            <p>
              Case stories from our protection desks — named files, named officers, and the hearings that
              restored homes and maintenance.
              {deskCount > 0 ? ` ${deskCount} stories on the desk page.` : ''}
            </p>
            <Link to="/desk" className="work-pill">
              Open The Desk →
            </Link>
          </Reveal>
        </div>
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
