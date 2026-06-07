import { Link } from 'react-router-dom';
import dadaPhoto from '../assets/dada.jpeg';
import dadiPhoto from '../assets/dadi.jpeg';
import fatherPhoto from '../assets/father.jpeg';
import './About.css';

const navSections = [
  { id: 'mission', label: 'Mission' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'team', label: 'Team' },
];

const values = [
  {
    num: '01',
    title: 'With You',
    body: 'We stand alongside communities through every step — from first consultation to courtroom strategy.',
  },
  {
    num: '02',
    title: 'For You',
    body: 'Our expertise, resources, and advocacy networks are deployed entirely in the public interest.',
  },
  {
    num: '03',
    title: 'Nyaya Tak',
    body: 'Relentless pursuit of justice until rights are secured, no matter how long the process takes.',
  },
];

const advocacyPoints = [
  { title: 'Protecting civil liberties', text: 'Pro-bono defense for undertrials at Delhi Central Jail, Tihar.' },
  { title: 'Enforcing accountability', text: 'RTI filings and advocacy for child-safety compliance nationwide.' },
  { title: 'Advancing disability rights', text: 'Litigation for reservations and equal opportunity in public employment.' },
];

const heritagePortraits = [
  {
    name: 'Late Sh. R.S. Garg',
    role: 'Advocate & Judicial Officer',
    caption:
      'A respected judicial officer in Haryana and leading Delhi practitioner whose pro-bono work inspired this Foundation.',
    image: dadaPhoto,
  },
  {
    name: 'Late Smt. Krishna Garg',
    role: 'Partner in service',
    caption:
      'Steadfast companion in decades of compassionate legal aid and community outreach.',
    image: dadiPhoto,
  },
];

const leadership = {
  name: 'Adv. Ajay Garg',
  role: 'Chief Trustee, RKLAF',
  caption:
    'Leading the Foundation today — ensuring accessible, fearless advocacy for every citizen who needs it.',
  image: fatherPhoto,
};

export default function About() {
  return (
    <div className="about-page">
      <header className="about-page-head" data-reveal="up">
        <div className="container">
          <p className="about-kicker">About Us</p>
          <h1>Our heritage, mission, and team</h1>
          <p className="about-page-head__lead">
            Established in 2016 to honor a family legacy of fearless advocacy — and to carry it forward
            for every citizen who needs it.
          </p>
        </div>
      </header>

      <nav className="about-nav" aria-label="On this page">
        <div className="container about-nav__inner">
          {navSections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="about-body">
        <section id="mission" className="about-section" data-reveal="up">
          <div className="container">
            <header className="about-section__head">
              <p className="about-kicker">Our Mandate</p>
              <h2>The law should be a shield, not an insurmountable barrier.</h2>
              <p>
                We democratize access to justice through pro-bono legal support, rights education,
                and fearless advocacy — standing with every citizen who cannot afford private counsel.
              </p>
            </header>

            <div className="about-values">
              {values.map((v) => (
                <article className="about-value-card" key={v.title}>
                  <span className="about-value-card__num">{v.num}</span>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-advocacy" data-reveal="up">
          <div className="container about-advocacy__grid">
            <div className="about-advocacy__intro">
              <p className="about-kicker about-kicker--light">What we do</p>
              <h2>On-ground impact with courtroom depth.</h2>
              <p>
                From prison visits to public-interest litigation, RKLAF combines direct legal aid with
                systemic reform — so individual relief and lasting change go hand in hand.
              </p>
              <Link to="/our-work/programs" className="btn btn-outline about-advocacy__link">
                Explore our programs
              </Link>
            </div>
            <ul className="about-advocacy__list">
              {advocacyPoints.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="heritage" className="about-section about-section--heritage" data-reveal="up">
          <div className="container">
            <header className="about-section__head about-section__head--center">
              <p className="about-kicker">Our Heritage</p>
              <h2>A living tribute to family, empathy, and doing what is right.</h2>
              <p>
                Established on November 25, 2016, RKLAF honors Late Sh. R.S. Garg and Late Smt. Krishna
                Garg — whose decades of pro-bono service for the poor, needy, and disabled inspire
                everything we do today.
              </p>
            </header>

            <div className="about-heritage-grid about-heritage-grid--two">
              {heritagePortraits.map((person) => (
                <article className="about-heritage-card" key={person.name}>
                  <div className="about-heritage-card__photo-wrap">
                    <img src={person.image} alt={person.name} loading="lazy" />
                  </div>
                  <div className="about-heritage-card__body">
                    <h3>{person.name}</h3>
                    <p className="about-heritage-card__role">{person.role}</p>
                    <p>{person.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="about-section" data-reveal="up">
          <div className="container">
            <header className="about-section__head">
              <p className="about-kicker">Our Team</p>
              <h2>Justice needs a formidable alliance.</h2>
              <p>
                RKLAF is amplified by leading legal minds and advocates — a platform for anyone
                who wants to pursue justice together.
              </p>
            </header>

            <div className="about-team-layout">
              <article className="about-leadership">
                <div className="about-leadership__photo">
                  <img src={leadership.image} alt={leadership.name} loading="lazy" />
                </div>
                <div className="about-leadership__body">
                  <p className="about-kicker">Leadership</p>
                  <h3>{leadership.name}</h3>
                  <p className="about-leadership__role">{leadership.role}</p>
                  <p>{leadership.caption}</p>
                </div>
              </article>

              <article className="about-team-card about-team-card--solo">
                <span className="about-team-card__icon" aria-hidden="true">A</span>
                <h3>Advocates</h3>
                <p>Courtroom representation and legal strategy across civil liberties, criminal defense, and public-interest matters.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-cta" data-reveal="scale">
          <div className="container about-cta__inner">
            <h2>Stand with us in the fight for justice.</h2>
            <p>
              Your support funds pro-bono representation, legal camps, and advocacy that reaches
              communities who need it most.
            </p>
            <div className="about-cta__actions">
              <Link to="/donate" className="btn btn-primary">Donate today</Link>
              <Link to="/join" className="btn btn-secondary">Join the mission</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
