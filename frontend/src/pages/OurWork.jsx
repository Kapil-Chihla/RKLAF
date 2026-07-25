import Reveal from '../components/motion/Reveal';
import './OurWork.css';

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

const reports = [
  { year: '2025–26', label: 'Impact, audited financials & ledger' },
  { year: '2024–25', label: 'Impact, audited financials & ledger' },
  { year: '2023–24', label: 'Impact, audited financials & ledger' },
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

export default function OurWork() {
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
        <div className="work-desk__banner">
          <div className="work-desk__banner-inner">
            <h2 className="work-desk__title">The Desk</h2>
            <p className="work-desk__ph">
              Full-bleed photo placeholder · Elderly couple at the tribunal steps, cinematic wide
            </p>
            <p className="work-desk__sub">
              <span aria-hidden="true">—</span> Senior Citizens · Project 01 <span aria-hidden="true">—</span>
            </p>
            <span className="work-desk__star" aria-hidden="true">✦</span>
          </div>
        </div>

        <div className="container work-desk__body">
          <div className="work-desk__copy">
            <div className="work-desk__lead">
              <span className="work-desk__num" aria-hidden="true">01</span>
              <div className="work-desk__lead-text">
                <p className="work-desk__kicker">Senior Citizens</p>
                <h3>Built from one wave of evictions</h3>
                <p>
                  In 2018 our helpline began ringing with the same story told in different voices: parents
                  moved into storerooms of houses they built, gift deeds signed under pressure, patience
                  mistaken for consent. The desk was built to answer that exact call, and it has never stopped.
                </p>
                <p>
                  A single case officer stays with each elder from intake to compliance. Volunteers sit beside
                  them at every hearing, so nobody faces a tribunal alone at seventy.
                </p>
              </div>
            </div>
          </div>

          <div className="work-desk__photos" aria-hidden="true">
            <figure className="work-frame work-frame--lg">
              <div className="work-frame__ph">
                <span>Photo · Kamla Devi receiving her order copy</span>
              </div>
            </figure>
            <figure className="work-frame work-frame--sm">
              <div className="work-frame__ph">
                <span>Detail · The cancelled gift deed</span>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Full account */}
      <section id="full-account" className="work-account">
        <div className="container work-account__inner">
          <Reveal as="div" variant="up">
            <p className="work-account__label">The full account</p>
            <h2 className="work-account__title">Four hundred elders, one method</h2>
            <p className="work-account__lead">
              How the Senior Citizens Protection Desk works — from the first helpline call to the order
              that restores a home, and the volunteer who sits through every hearing.
            </p>
            <a href="#desk" className="work-pill">Full story →</a>
          </Reveal>
        </div>
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
            {reports.map((r) => (
              <article className="work-report" key={r.year}>
                <span className="work-report__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 3h8l4 4v14H7V3z" />
                    <path d="M15 3v4h4M9 12h6M9 16h4" />
                  </svg>
                </span>
                <div className="work-report__text">
                  <h3>Annual Report {r.year}</h3>
                  <p>{r.label}</p>
                </div>
                <a href="#reports" className="work-report__pdf">Pdf ↓</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
