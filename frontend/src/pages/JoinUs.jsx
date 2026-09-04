import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import './JoinUs.css';

const FORMS = {
  volunteer:
    'https://docs.google.com/forms/d/e/1FAIpQLSezA4msVzQ6o0W28-s1l4s6x93Xe-hFVV4gN_5MpfK6dwan8A/viewform',
  internship:
    'https://docs.google.com/forms/d/e/1FAIpQLSfBre-N6uFviHz1wdxCVbm378xSvY49d5m13Hql-7X3g8fY8w/viewform',
  member:
    'https://docs.google.com/forms/d/e/1FAIpQLSfftpM999p7Eo1Ngtst06MrxOTZs1ftmsCOKzN7WM8_wAXbQg/viewform',
  collaborate:
    'https://docs.google.com/forms/d/e/1FAIpQLSeposIeYJy02FNj08yCJr2MV_n_ORIZ-zv7VECach9i1CdrUw/viewform',
};

const tracks = [
  {
    id: 'volunteer',
    num: '01',
    tone: 'light',
    title: 'Volunteer',
    who: 'Give Your Time. Create an Impact.',
    blurb:
      "You don't need to be a lawyer to contribute to access to justice. RKLAF welcomes individuals who want to use their time, skills, and energy to support our work across legal awareness, community outreach, research, campaigns, events, communications, and social-impact initiatives.",
    listTitle: 'As a volunteer, you may contribute to',
    list: [
      'Legal awareness and community outreach',
      'Research and documentation',
      'Public awareness campaigns',
      'Social media and digital initiatives',
      'Events and workshops',
      'Data collection and compilation',
      'Administrative and programme support',
      'Other RKLAF initiatives based on your skills and interests',
    ],
    knowTitle: 'Who can volunteer?',
    know: [
      {
        k: 'Open to all',
        v: 'Students, professionals, researchers, educators, creatives, social workers, and individuals from any background who share our commitment to access to justice.',
      },
    ],
    badge: 'Your contribution matters',
    cta: 'Become a Volunteer →',
    href: FORMS.volunteer,
    icon: 'hands',
  },
  {
    id: 'internship',
    num: '02',
    tone: 'dark',
    popular: true,
    title: 'Internship',
    who: 'Learn Law Beyond the Classroom.',
    blurb:
      'At RKLAF, an internship is not limited to observing legal work. It is an opportunity to understand how law operates in courtrooms, communities, institutions, and everyday life.',
    listTitle: 'Interns may work on',
    list: [
      'Legal research and case analysis',
      'Drafting and documentation',
      'Case and data compilation',
      'RTI and public-interest initiatives',
      'Legal awareness programmes',
      'Community outreach',
      'Policy and social research',
      'Content and communication initiatives',
      'Social media and public awareness campaigns',
      'Other ongoing projects of the Foundation',
    ],
    knowTitle: 'Duration & who can apply',
    know: [
      {
        k: 'Minimum 2 months',
        v: "Duration and nature may vary depending on the Foundation's ongoing projects and the particular engagement.",
      },
      {
        k: 'Who',
        v: 'Law students and, where relevant, students or young professionals from other disciplines interested in law, public policy, research, and social impact.',
      },
    ],
    badge: 'Subject to requirements & availability',
    cta: 'Apply for an Internship →',
    href: FORMS.internship,
    icon: 'grad',
  },
  {
    id: 'member',
    num: '03',
    tone: 'tan',
    title: 'Become a Member',
    who: "Don't Just Support the Mission. Become Part of It.",
    blurb:
      'Membership is for individuals who want a long-term association with RKLAF and wish to contribute to its work beyond a single internship, programme, or volunteering opportunity.',
    listTitle: 'Membership may provide opportunities to',
    list: [
      'Participate in RKLAF initiatives and programmes',
      'Contribute to research and advocacy projects',
      'Attend member engagements and discussions',
      'Support community and legal-awareness initiatives',
      'Collaborate with other members and professionals',
      'Contribute your expertise and skills to Foundation projects',
      'Participate in special campaigns and institutional initiatives',
    ],
    knowTitle: 'Who should join?',
    know: [
      {
        k: 'Community',
        v: "Advocates, law students, academics, researchers, professionals, social-sector practitioners, and individuals who share RKLAF's vision.",
      },
    ],
    badge: 'Subject to membership framework',
    cta: 'Become a Member →',
    href: FORMS.member,
    icon: 'leaf',
  },
  {
    id: 'collaborate',
    num: '04',
    tone: 'dashed',
    title: 'Partner with Us',
    who: "Let's Create Greater Impact, Together.",
    blurb:
      'Some challenges cannot be solved by one institution alone. RKLAF collaborates with lawyers, law firms, educational institutions, NGOs, civil-society organisations, corporations, researchers, government and public institutions, and other stakeholders.',
    listTitle: 'We welcome partnerships for',
    list: [
      'Legal Aid & Access to Justice',
      'Legal Literacy & Awareness',
      'Research & Policy',
      'School & Child Safety',
      'CSR & Social Impact',
      'Knowledge & Capacity Building',
      'Media & Outreach',
    ],
    knowTitle: 'Have an idea?',
    know: [
      {
        k: "Let's build",
        v: 'If your organisation has a programme, resource, expertise, network, or idea that can contribute to a more just and informed society, we would like to hear from you.',
      },
    ],
    badge: 'Collaborative impact',
    cta: 'Partner with RKLAF →',
    href: FORMS.collaborate,
    icon: 'building',
  },
];

const steps = [
  {
    n: '1',
    title: 'Apply',
    desc: 'Tell us who you are, what you care about, and how you would like to contribute.',
  },
  {
    n: '2',
    title: 'Review',
    desc: 'Our team carefully reviews applications against the requirements and opportunities available at the time.',
  },
  {
    n: '3',
    title: 'Connect',
    desc: 'Shortlisted applicants may be contacted for further information or an interaction, where required.',
  },
  {
    n: '4',
    title: 'Begin',
    desc: 'Selected applicants receive confirmation and the information needed to begin their association with RKLAF.',
  },
  {
    n: '5',
    title: 'Make an Impact',
    desc: 'Work alongside the RKLAF team and contribute to initiatives that advance access to justice and create meaningful social impact.',
  },
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
          <li key={item}>{item}</li>
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
        <a
          href={track.href}
          className="join-card__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {track.cta}
        </a>
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
              Be Part of the <em>Work</em>
            </h1>
            <p className="join-hero__lead">
              Justice is not created by institutions alone. It is built by people who choose to contribute
              their time, knowledge, skills, and resources. Whether you are a student looking to learn, a
              professional looking to contribute, an organisation looking to collaborate, or simply someone
              who believes that access to justice should be universal, there is a place for you at RKLAF.
            </p>
            <p className="join-hero__stats">Choose how you want to contribute.</p>
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
            <p className="join-label">Your journey with RKLAF</p>
            <h2>Apply → Review → Connect → Begin</h2>
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
        </div>
      </section>

      <section className="join-cta">
        <div className="container">
          <Reveal as="div" className="join-cta__band" variant="up">
            <div>
              <h2>Not sure which track fits?</h2>
              <p>
                Write to us about yourself and how you would like to contribute. Please note: submission of an
                application does not guarantee selection or placement. Applications are reviewed on a rolling
                basis and opportunities are subject to the requirements and availability of the Foundation.
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
