import { Link } from 'react-router-dom';
import WhereWeWorkSection from '../components/impact/WhereWeWorkSection';
import heroImage from '../assets/hero.jpeg';
import father2Photo from '../assets/father2.jpeg';
import './Home.css';

const introStats = [
  { value: '2016', label: 'Registered as a Charitable Trust' },
  { value: '3,100+', label: 'People engaged through camps & outreach' },
  { value: '40+', label: 'On-ground legal aid camps' },
  { value: '80+', label: 'Law students in national RTI drives' },
];

const whyItems = [
  {
    num: '01',
    title: 'Pro-Bono Legal Aid',
    points: ['Civil & criminal casework', 'Prison visits & undertrial support', 'Courtroom representation'],
  },
  {
    num: '02',
    title: 'Rights Education',
    points: ['Know Your Rights resources', 'Downloadable legal guides', 'Community awareness camps'],
  },
  {
    num: '03',
    title: 'Public-Interest Advocacy',
    points: ['RTI & accountability drives', 'Disability rights litigation', 'Systemic reform'],
  },
  {
    num: '04',
    title: 'Community Outreach',
    points: ['On-ground legal aid camps', 'Law student partnerships', 'Nationwide collaborations'],
  },
];

const practiceAreas = [
  { title: 'Civil Law', desc: 'Property, family, and contractual disputes.', icon: 'C' },
  { title: 'Criminal Defense', desc: 'Fair representation and procedural guidance.', icon: 'D' },
  { title: 'Human Rights', desc: 'Protection of dignity, liberty, and equality.', icon: 'H' },
];

const programPillars = [
  {
    num: '01',
    title: 'Legal Aid Camps',
    desc: 'Free on-ground consultations and rights awareness — reaching citizens where they live.',
  },
  {
    num: '02',
    title: 'Pro-Bono Casework',
    desc: 'Representation and guidance for those who cannot afford private counsel.',
  },
  {
    num: '03',
    title: 'Advocacy & Education',
    desc: 'RTI drives, public-interest litigation, and Know Your Rights outreach.',
  },
];

export default function Home() {
  return (
    <div className="home">
      {/* Lyfpro-style hero — full-bleed image + white overlay panel */}
      <section className="home-hero">
        <div className="home-hero__media" aria-hidden="true">
          <img src={heroImage} alt="" className="home-hero__bg" />
          <div className="home-hero__shade" />
        </div>

        <div className="home-hero__stage">
          <div className="container home-hero__inner">
            <div className="home-hero__panel">
              <p className="home-hero__kicker">
                <span className="home-hero__kicker-line" aria-hidden="true" />
                Radhey Krishna Legal Aid Foundation
              </p>
              <h1 className="home-hero__title">
                Justice should never be a privilege reserved for the few.
              </h1>
              <p className="home-hero__lead">
                A coalition of legal professionals and advocates protecting constitutional
                rights — regardless of background or financial standing.
              </p>
              <div className="home-hero__actions">
                <Link to="/donate" className="btn btn-primary btn-lg">Support our work</Link>
                <Link to="/contact" className="btn btn-outline btn-lg home-hero__outline">Get in touch</Link>
              </div>
              <p className="home-hero__motto">
                <strong>With You. For You. Nyaya Tak</strong>
              </p>
            </div>
          </div>

          <div className="home-hero__accent" aria-hidden="true">
            <span>Nyaya Tak</span>
          </div>
        </div>
      </section>

      <section className="home-stats-bar" aria-label="Impact at a glance">
        <div className="container home-stats-bar__row">
          {introStats.map((stat) => (
            <article className="home-stats-bar__item" key={stat.label}>
              <strong className="home-stats-bar__value">{stat.value}</strong>
              <span className="home-stats-bar__label">{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      {/* Why choose us — numbered grid */}
      <section className="home-why">
        <div className="container">
          <header className="home-section-head home-section-head--center">
            <p className="home-kicker">Why choose us</p>
            <h2 className="home-section-title">Accessible justice is what every citizen deserves</h2>
          </header>
          <div className="home-why__grid">
            {whyItems.map((item) => (
              <article className="home-why-card" key={item.num}>
                <span className="home-why-card__num">{item.num}</span>
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About — editorial split */}
      <section className="home-about">
        <div className="container">
          <div className="home-about__card">
            <div className="home-about__visual">
              <div className="home-about__frame" aria-hidden="true" />
              <div className="home-about__photo">
                <img src={father2Photo} alt="Adv. Ajay Garg, Chief Trustee, RKLAF" loading="lazy" />
              </div>
            </div>

            <div className="home-about__copy">
              <p className="home-about__kicker">
                <span className="home-about__kicker-line" aria-hidden="true" />
                About us
              </p>
              <h2 className="home-about__title">Rooted in service, driven by fearless advocacy</h2>
              <blockquote className="home-about__quote">
                <span className="home-about__quote-mark" aria-hidden="true">“</span>
                <p>
                  We stand alongside every citizen who cannot afford private counsel — from first
                  consultation to courtroom strategy.
                </p>
                <footer>
                  <span className="home-about__role">Chief Trustee, RKLAF</span>
                  Adv. Ajay Garg
                </footer>
              </blockquote>
              <div className="home-about__actions">
                <Link to="/about#heritage" className="btn btn-primary">Explore our story</Link>
                <Link to="/about#team" className="btn btn-outline home-about__outline">Meet our team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do — programs + practice areas */}
      <section className="home-work">
        <div className="container">
          <header className="home-section-head home-section-head--center">
            <p className="home-kicker">What we do</p>
            <h2 className="home-section-title">Programs, outreach, and the areas we serve</h2>
            <p className="home-section-lead">
              From grassroots camps to courtroom representation — building a fairer legal landscape for every citizen.
            </p>
          </header>

          <div className="home-work__stage">
            <div className="home-work__programs">
              <div className="home-work__panel-head">
                <span className="home-work__panel-line" aria-hidden="true" />
                <h3>Our programs</h3>
              </div>
              <ol className="home-work__timeline">
                {programPillars.map((item) => (
                  <li key={item.title} className="home-work__timeline-item">
                    <span className="home-work__num">{item.num}</span>
                    <div className="home-work__timeline-body">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link to="/our-work/programs#gallery" className="home-work__cta btn btn-light">
                Programs &amp; camp gallery
                <span className="home-work__cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="home-work__areas">
              <div className="home-work__panel-head home-work__panel-head--light">
                <span className="home-work__panel-line" aria-hidden="true" />
                <h3>Areas we serve</h3>
              </div>
              <div className="home-work__areas-grid">
                {practiceAreas.map((area) => (
                  <article key={area.title} className="home-work-area">
                    <span className="home-work-area__icon" aria-hidden="true">{area.icon}</span>
                    <div className="home-work-area__text">
                      <h4>{area.title}</h4>
                      <p>{area.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhereWeWorkSection />

      {/* Dual panels */}
      <section className="home-dual">
        <div className="container home-dual__grid">
          <article className="home-dual__panel home-dual__panel--dark">
            <h2>Learn. Research. Act.</h2>
            <ul className="home-dual__links">
            <li><Link to="/know-your-rights">Know Your Rights</Link></li>
              <li><Link to="/know-your-rights#guides">Downloadable Guides</Link></li>
              <li><Link to="/know-your-rights#emergency">Emergency Contacts</Link></li>
              <li><Link to="/contact#intake">Intake Procedure</Link></li>
              <li><Link to="/noted-judgments">Noted Judgments</Link></li>
              <li><Link to="/join">Join the Fight for Justice</Link></li>
            </ul>
          </article>
          <article className="home-dual__panel home-dual__panel--light">
            <p className="home-kicker">From our blog</p>
            <h2>Stories from the field</h2>
            <p>Legal updates, camp recaps, and voices from advocates on the ground.</p>
            <Link to="/blogs" className="btn btn-secondary">View all blogs</Link>
          </article>
        </div>
      </section>

      <section className="home-donate">
        <div className="container home-donate__inner">
          <p className="home-kicker home-kicker--light">Support RKLAF</p>
          <h2>Stand with us for equal access to justice</h2>
          <p>Your contribution funds camps, casework, and free legal resources.</p>
          <div className="home-donate__actions">
            <Link to="/donate" className="btn btn-light btn-lg">Donate Now</Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg">Get in touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
