import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import './JoinUs.css';

const tracks = [
  {
    id: 'volunteer',
    num: '01',
    tone: 'light',
    title: 'Volunteer',
    who: 'For anyone · no legal background needed',
    blurb:
      'The hands of the foundation. Two hours a week is enough to change what a week feels like for someone in the queue.',
    listTitle: "What you'll do",
    list: [
      'Answer helpline shifts after a 2-day training',
      'Assist at weekend legal camps near you',
      'Accompany elderly clients to hearings',
      'Translate rights modules into local languages',
      'Maintain the tribute register at camp desks',
    ],
    knowTitle: 'Good to know',
    know: [
      { k: '18+', v: 'Any background, no law degree needed' },
      { k: '2 days', v: 'Paid-for training before your first shift' },
      { k: '9 districts', v: 'Camp & helpline roles, some remote' },
    ],
    badge: '2 to 6 hrs / week',
    cta: 'Apply as volunteer →',
    href: '/contact',
    icon: 'hands',
  },
  {
    id: 'internship',
    num: '02',
    tone: 'dark',
    popular: true,
    title: 'Internship',
    who: 'For law students · 4 to 12 week cohorts',
    blurb:
      'Real intake desks, real petitions, real hearings. The drafting you do here gets filed, not shelved.',
    listTitle: "What you'll do",
    list: [
      'Run intake desks under advocate supervision',
      'Draft petitions that get filed, with feedback on every draft',
      'Court observation with weekly debriefs',
      'Rebuild evidence records, the 42-worker wage method',
      'Close with a case study presented to the founders',
    ],
    knowTitle: 'Good to know',
    know: [
      { k: '2nd yr+', v: 'Law students, any university' },
      { k: '20 seats', v: 'Per cohort · on-site & hybrid tracks' },
      { k: 'Cert + LoR', v: 'On completion, tied to your case log' },
    ],
    badge: 'Cohorts open quarterly',
    cta: 'Apply for internship →',
    href: '/contact',
    icon: 'grad',
  },
  {
    id: 'member',
    num: '03',
    tone: 'tan',
    title: 'Member',
    who: 'For professionals & well-wishers',
    blurb:
      'Steady hands behind the casework. Members fund filings through the year and see exactly where each rupee lands.',
    listTitle: 'What membership carries',
    list: [
      'Fund a fixed number of case filings yearly',
      'Quarterly impact briefings with the founders',
      'Outcome letter for every filing you sponsor',
      'Name listed in the annual report, if you wish',
      'Advocates: join the pro bono panel',
    ],
    knowTitle: 'Tiers',
    know: [
      { k: '₹500', v: 'Friend · 4 filings a year' },
      { k: '₹1,500', v: 'Patron · 12 filings a year' },
      { k: '₹5,000', v: 'Guardian · a camp + filings' },
    ],
    badge: '80G receipts · cancel anytime',
    cta: 'Become a member →',
    href: '/contact',
    icon: 'leaf',
  },
  {
    id: 'collaborate',
    num: '04',
    tone: 'dashed',
    title: 'Collaborate with us',
    who: 'For colleges, law firms, NGOs & CSR teams',
    blurb:
      'Bring your institution alongside ours. Partnerships run from campus clinics to co-hosted camps and funded research.',
    listTitle: 'Partnership models',
    list: [
      'Host a campus legal clinic with our curriculum',
      'Co-run camps or literacy drives in your district',
      'Fund research, a desk, or a fellowship via CSR',
      'Law firms: second associates to the pro bono panel',
      'NGOs: refer matters and cross-train field teams',
    ],
    knowTitle: 'How it runs',
    know: [
      { k: 'MoU', v: 'Simple 3-page agreement, annual renewal' },
      { k: 'We bring', v: 'Curriculum, training, supervision, brand' },
      { k: 'You bring', v: 'Space, students or funds, local reach' },
    ],
    badge: '12 partners · 4 states',
    cta: 'Start a conversation →',
    href: '/contact',
    icon: 'building',
  },
];

const steps = [
  {
    n: '1',
    title: 'Apply',
    desc: 'One short form. Tell us your track, your city and your hours. No CV needed for volunteering.',
  },
  {
    n: '2',
    title: 'Hear from a human',
    desc: 'A coordinator calls within 5 working days to match you to a desk, cohort or partnership lead.',
  },
  {
    n: '3',
    title: 'Begin with an oath',
    desc: "Training, a mentor, and the volunteer's oath taken at your first camp or clinic day.",
  },
];

const orbs = [
  { label: 'Volunteer at camp desk', pill: 'Volunteer', cls: 'a' },
  { label: 'Intern in court', pill: 'Intern', cls: 'b' },
  { label: 'Member briefing', pill: 'Member', cls: 'c' },
  { label: 'Partner college', pill: 'Collaborate', cls: 'd' },
];

function TrackIcon({ name }) {
  if (name === 'grad') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 10l9-5 9 5-9 5-9-5z" />
        <path d="M7 12v4c2 2 8 2 10 0v-4" />
      </svg>
    );
  }
  if (name === 'leaf') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 19c8-1 12-8 14-15-6 2-12 7-14 15z" />
        <path d="M5 19c3-4 7-7 12-9" />
      </svg>
    );
  }
  if (name === 'building') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 20h16M6 20V10l6-4 6 4v10" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 11a3 3 0 116 0v1H8v-1z" />
      <path d="M6 14c0 3 2.5 5 6 5s6-2 6-5" />
    </svg>
  );
}

function TrackCard({ track }) {
  return (
    <article className={`join-card join-card--${track.tone}`} id={track.id}>
      {track.popular ? <span className="join-card__popular">Most popular</span> : null}
      <div className="join-card__top">
        <span className="join-card__icon" aria-hidden="true">
          <TrackIcon name={track.icon} />
        </span>
        <span className="join-card__num" aria-hidden="true">
          {track.num}
        </span>
      </div>
      <h3>{track.title}</h3>
      <p className="join-card__who">{track.who}</p>
      <p className="join-card__blurb">{track.blurb}</p>

      <p className="join-card__section">{track.listTitle}</p>
      <ul className="join-card__list">
        {track.list.map((item) => (
          <li key={item}>— {item}</li>
        ))}
      </ul>

      <p className="join-card__section">{track.knowTitle}</p>
      <div className="join-card__know">
        {track.know.map((k) => (
          <div key={k.k}>
            <strong>{k.k}</strong>
            <span>{k.v}</span>
          </div>
        ))}
      </div>

      <div className="join-card__foot">
        <span className="join-card__badge">{track.badge}</span>
        <Link to={track.href} className="join-card__cta">
          {track.cta}
        </Link>
      </div>
    </article>
  );
}

export default function JoinUs() {
  return (
    <div className="join">
      <header className="join-hero">
        <div className="container join-hero__grid">
          <Reveal as="div" className="join-hero__copy" variant="up">
            <div className="join-hero__mark" aria-hidden="true">
              <span className="join-hero__line" />
              <span className="join-hero__dot" />
            </div>
            <p className="join-label">Join us</p>
            <h1>
              Justice is a <em>team</em> sport
            </h1>
            <p className="join-hero__lead">
              Four ways in, one promise out: every hour you give shortens somebody&apos;s queue. No legal
              background needed for most roles, and every application gets a human reply within 5 working
              days.
            </p>
            <p className="join-hero__stats">
              ✦ 240 volunteers · 80+ student interns · 12 partner institutions and counting
            </p>
          </Reveal>

          <Reveal as="div" className="join-hero__visual" variant="scale" delay={60} aria-hidden="true">
            {orbs.map((o) => (
              <div key={o.cls} className={`join-orb join-orb--${o.cls}`}>
                <span className="join-orb__label">{o.label}</span>
                <span className="join-orb__pill">{o.pill}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </header>

      <section id="tracks" className="join-tracks">
        <div className="container join-tracks__grid">
          {tracks.map((t, i) => (
            <Reveal key={t.id} as="div" variant="up" delay={i * 40}>
              <TrackCard track={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how" className="join-how">
        <div className="container">
          <Reveal as="header" className="join-how__head" variant="up">
            <p className="join-label">How it works</p>
            <h2>Three steps, five working days</h2>
          </Reveal>

          <div className="join-how__steps">
            {steps.map((s, i) => (
              <Reveal key={s.n} as="div" className="join-step" variant="up" delay={i * 50}>
                <span className="join-step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 ? <span className="join-step__arrow" aria-hidden="true">···→</span> : null}
              </Reveal>
            ))}
          </div>

          <Reveal as="figure" className="join-photo" variant="up" delay={80}>
            <div className="join-photo__tape" aria-hidden="true" />
            <div className="join-photo__frame">
              <span>Wide group photo placeholder</span>
              <small>Oath day: the 2026 cohort of volunteers and interns on the court steps.</small>
            </div>
            <figcaption>Oath day, cohort of 2026</figcaption>
          </Reveal>
        </div>
      </section>

      <section className="join-cta">
        <div className="container">
          <Reveal as="div" className="join-cta__band" variant="up">
            <div>
              <h2>Not sure which track fits?</h2>
              <p>
                Write two lines about yourself and we will suggest one. Every message gets a human reply
                within 5 working days.
              </p>
            </div>
            <Link to="/contact" className="join-cta__btn">
              Talk to a coordinator →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
