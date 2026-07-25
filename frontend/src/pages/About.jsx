import { useState } from 'react';
import Reveal from '../components/motion/Reveal';
import './About.css';

const team = [
  {
    name: 'Adv. Ajay Garg',
    role: 'Founder & Managing Trustee',
    blurb: 'Leads case strategy and the Foundation’s courtroom mandate.',
  },
  {
    name: 'Trustee — Desk Lead',
    role: 'Senior Citizens Desk',
    blurb: 'Maintenance, property protection, and elder-abuse matters.',
  },
  {
    name: 'Trustee — Outreach',
    role: 'Camps & Helpline',
    blurb: 'Runs on-ground camps and first-response triage.',
  },
  {
    name: 'Volunteer Cohort',
    role: 'Law Students & Fellows',
    blurb: 'RTI drives, research desks, and clinic support.',
  },
];

const journey = [
  {
    year: '2014',
    icon: 'sprout',
    label: 'First clinic seeds',
    title: 'The idea takes root',
    desc: 'Informal aid desks and family-led counsel begin shaping what would become the Foundation.',
    visual: 'Field notebook',
  },
  {
    year: '2016',
    icon: 'scroll',
    label: 'Trust deed signing day',
    title: 'Registered as a charitable trust',
    desc: 'The work gets a name and a legal form: the Radhey Krishna Legal Aid Foundation, a tribute carried into a mandate.',
    visual: 'Trust deed signing day',
  },
  {
    year: '2018',
    icon: 'desk',
    label: 'Senior citizens desk',
    title: 'Flagship protection desk opens',
    desc: 'A dedicated desk for elders — maintenance, property, and abuse under the 2007 Act.',
    visual: 'Desk at the tribunal',
  },
  {
    year: '2021',
    icon: 'grad',
    label: 'Student cohort',
    title: 'National RTI & campus clinics',
    desc: 'Law students join structured drives unlocking pensions, ration, and scheme entitlements.',
    visual: 'Campus clinic day',
  },
  {
    year: '2024',
    icon: 'globe',
    label: 'Wider map',
    title: 'Camps across more districts',
    desc: 'Outreach widens — village rights camps, diaspora queries, and deeper public-interest work.',
    visual: 'District camp map',
  },
  {
    year: '2026',
    icon: 'court',
    label: 'Still showing up',
    title: 'A decade into the mandate',
    desc: 'The same sentence still holds: nobody loses a case because they could not afford to fight it.',
    visual: 'Courthouse steps',
  },
];

function JourneyIcon({ name }) {
  if (name === 'sprout') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 20V10M12 10c0-4 3-7 7-7-1 4-4 7-7 7zm0 0c0-4-3-7-7-7 1 4 4 7 7 7z" />
      </svg>
    );
  }
  if (name === 'scroll') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M6 5h10a2 2 0 012 2v12H8a2 2 0 01-2-2V5zm0 0H5a2 2 0 00-2 2v1h3M18 19h1a2 2 0 002-2v-1h-3M9 10h6M9 14h4" />
      </svg>
    );
  }
  if (name === 'desk') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="9" r="3" />
        <path d="M5 19c1.5-3 4-5 7-5s5.5 2 7 5" />
      </svg>
    );
  }
  if (name === 'grad') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 10l9-5 9 5-9 5-9-5zm3 4v4l6 3 6-3v-4" />
      </svg>
    );
  }
  if (name === 'globe') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 20h16M6 20V10l6-4 6 4v10M10 20v-5h4v5" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="about-label" aria-hidden="false">
      <span className="about-label__rule" />
      <span className="about-label__star" aria-hidden="true">✦</span>
      <span className="about-label__text">{children}</span>
      <span className="about-label__star" aria-hidden="true">✦</span>
      <span className="about-label__rule" />
    </div>
  );
}

export default function About() {
  const [activeYear, setActiveYear] = useState(1);
  const current = journey[activeYear];

  const goPrev = () => setActiveYear((i) => (i - 1 + journey.length) % journey.length);
  const goNext = () => setActiveYear((i) => (i + 1) % journey.length);

  return (
    <div className="about about--v2">
      {/* Mandate */}
      <section id="mandate" className="about-mandate">
        <div className="container">
          <Reveal as="div" className="about-mandate__copy" variant="up">
            <SectionLabel>Our mandate</SectionLabel>
            <h1 className="about-mandate__title">
              Nobody loses a case because they{' '}
              <em>could not afford</em> to fight it.
            </h1>
            <p className="about-mandate__lead">
              That single sentence is our entire mission. Everything else — the camps, the helpline,
              the podcast, the classrooms — exists to keep it true across every district we serve.
              Free legal aid, plain-language education, and representation carried through to the final order.
            </p>
            <div className="about-mandate__seal" aria-hidden="true">
              <span className="about-mandate__seal-ring">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M24 8v32M14 14h20M16 14l-5 14h10L16 14zm16 0l-5 14h10L32 14z" />
                </svg>
              </span>
            </div>
          </Reveal>

          <Reveal as="div" className="about-media" variant="up" delay={120}>
            <div className="about-film">
              <span className="about-film__badge">Film · 4 min</span>
              <div className="about-film__center">
                <p className="about-film__ph-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 7h11l2-2h3v14H4V7zM9 11h4M9 15h6" />
                  </svg>
                  Video placeholder
                </p>
                <button type="button" className="about-film__play" aria-label="Play film (coming soon)" disabled>
                  <span className="about-film__play-ring" aria-hidden="true" />
                  <span className="about-film__play-tri" aria-hidden="true" />
                </button>
              </div>
              <p className="about-film__caption">
                The founder in the first one-room clinic, telling the story to camera.
                Warm, unhurried, subtitled in Hindi &amp; English.
              </p>
            </div>

            <aside className="about-quote-card">
              <span className="about-quote-card__marks" aria-hidden="true">“</span>
              <p>
                My grandfather queued outside a court for eleven years and never once sat before a judge.
                This foundation carries his name so that no one else’s story ends in the queue.
              </p>
              <footer>
                <strong>Adv. Ajay Garg</strong>
                <span className="about-quote-card__role">Founder &amp; Managing Trustee</span>
                <a href="#mandate" className="about-quote-card__link">Watch the film →</a>
              </footer>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Heritage */}
      <section id="heritage" className="about-heritage">
        <div className="container">
          <Reveal as="div" className="about-heritage__panel" variant="up">
            <div className="about-heritage__top">
              <p className="about-heritage__eyebrow">Our heritage</p>
              <h2 className="about-heritage__title">In their name</h2>
              <p className="about-heritage__intro">
                The foundation is a tribute before it is an organisation. These are the people whose lives,
                and whose waits, opened this door for everyone who walks through it now.
              </p>
            </div>

            <div className="about-heritage__grid">
              <div className="about-polaroids">
                <figure className="about-polaroid about-polaroid--a">
                  <div className="about-polaroid__tape" />
                  <div className="about-polaroid__frame">
                    <span className="about-polaroid__tag">Archival portrait</span>
                    <small>Late Shri Radhey Krishna ji, c. 1968</small>
                  </div>
                  <figcaption>Shri Radhey Krishna ji</figcaption>
                </figure>
                <figure className="about-polaroid about-polaroid--b">
                  <div className="about-polaroid__tape" />
                  <div className="about-polaroid__frame">
                    <span className="about-polaroid__tag">Archival photo</span>
                    <small>The family outside the district court, c. 1974</small>
                  </div>
                  <figcaption>The eleven-year queue, 1974</figcaption>
                </figure>
              </div>

              <div className="about-heritage__right">
                <p>
                  He was a farmer who believed the courthouse belonged to every citizen — not only those
                  who could pay to wait inside it. Eleven years in a queue outside a district court became
                  the story this foundation refuses to repeat.
                </p>
                <p>
                  Families who walk into our camps still add names to the tribute register. Each name is a
                  reminder that the mandate is personal before it is institutional.
                </p>
                <p className="about-heritage__names">
                  Radhey Krishna ji · Smt. Kaushalya Devi · and the elders of every camp
                </p>
                <div className="about-heritage__diyas" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M6 16c0 2 2.5 3.5 6 3.5s6-1.5 6-3.5c0-2-2-3-3.5-4.5C13 10 12 8 12 8s-1 2-2.5 3.5C8 13 6 14 6 16z" fill="#c46a3a"/><path d="M5 17.5c1 2.2 3.5 3.5 7 3.5s6-1.3 7-3.5" fill="none" stroke="#e8dcc8" strokeWidth="1.4"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M6 16c0 2 2.5 3.5 6 3.5s6-1.5 6-3.5c0-2-2-3-3.5-4.5C13 10 12 8 12 8s-1 2-2.5 3.5C8 13 6 14 6 16z" fill="#c46a3a"/><path d="M5 17.5c1 2.2 3.5 3.5 7 3.5s6-1.3 7-3.5" fill="none" stroke="#e8dcc8" strokeWidth="1.4"/></svg>
                  <svg viewBox="0 0 24 24"><path d="M6 16c0 2 2.5 3.5 6 3.5s6-1.5 6-3.5c0-2-2-3-3.5-4.5C13 10 12 8 12 8s-1 2-2.5 3.5C8 13 6 14 6 16z" fill="#c46a3a"/><path d="M5 17.5c1 2.2 3.5 3.5 7 3.5s6-1.3 7-3.5" fill="none" stroke="#e8dcc8" strokeWidth="1.4"/></svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="about-team">
        <div className="container">
          <Reveal as="header" className="about-team__head" variant="up">
            <p className="about-eyebrow">The team</p>
            <h2 className="about-display">The people who show up</h2>
          </Reveal>

          <div className="about-team__grid">
            {team.map((member, i) => (
              <Reveal as="article" className="about-person" key={member.name} variant="up" delay={i * 70}>
                <div className="about-person__avatar" aria-hidden="true">
                  <span>{member.name.split(' ').slice(-1)[0].slice(0, 1)}</span>
                </div>
                <h3>{member.name}</h3>
                <p className="about-person__role">{member.role}</p>
                <p className="about-person__blurb">{member.blurb}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="about-journey">
        <div className="container">
          <Reveal as="header" className="about-journey__head" variant="up">
            <p className="about-eyebrow">The journey</p>
            <h2 className="about-display">A decade, year by year</h2>
            <p className="about-journey__hint">Click a year to travel</p>
          </Reveal>

          <div className="about-timeline" role="tablist" aria-label="Decade timeline">
            <div className="about-timeline__line" aria-hidden="true" />
            {journey.map((item, i) => (
              <button
                key={item.year}
                type="button"
                role="tab"
                aria-selected={i === activeYear}
                className={`about-timeline__node ${i === activeYear ? 'is-active' : ''}`}
                onClick={() => setActiveYear(i)}
              >
                <span className="about-timeline__icon" aria-hidden="true">
                  <JourneyIcon name={item.icon} />
                </span>
                <span className="about-timeline__year">{item.year}</span>
              </button>
            ))}
          </div>

          <Reveal as="article" className="about-year-card" variant="up" key={current.year}>
            <div className="about-year-card__visual">
              <span>{current.visual}</span>
              <small>{current.label}</small>
            </div>
            <div className="about-year-card__body">
              <p className="about-year-card__year">{current.year}</p>
              <h3>{current.title}</h3>
              <p>{current.desc}</p>
              <div className="about-year-card__nav">
                <button type="button" onClick={goPrev} aria-label="Previous year">←</button>
                <button type="button" onClick={goNext} aria-label="Next year">→</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
