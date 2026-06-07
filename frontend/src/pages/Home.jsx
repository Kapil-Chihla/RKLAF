import { Link } from 'react-router-dom';
import WhereWeWorkSection from '../components/impact/WhereWeWorkSection';
import Reveal from '../components/motion/Reveal';
import heroImage from '../assets/probono3.jpeg';
import father2Photo from '../assets/father2.jpeg';
import probonoPhoto from '../assets/probono2-card.jpeg';
import rightsEducationPhoto from '../assets/rightseducation.jpeg';
import publicInterestPhoto from '../assets/publicinterest.jpeg';
import communityOutreachPhoto from '../assets/comunityoutreach.jpeg';
import './Home.css';

const introStats = [
  { value: '2016', label: 'Registered as a Charitable Trust' },
  { value: '3,100+', label: 'People engaged through camps & outreach' },
  { value: '40+', label: 'On-ground legal aid camps' },
  { value: '80+', label: 'Law students in national RTI drives' },
];

const whyItems = [
  {
    id: 'probono',
    tag: 'Legal Aid',
    title: 'Pro-Bono Legal Aid',
    summary: 'Civil and criminal casework, prison visits, and courtroom representation for those who cannot afford private counsel.',
    image: probonoPhoto,
    alt: 'Pro-bono legal aid and courtroom support',
    objectPosition: 'center 68%',
    accent: '#834256',
    points: ['Civil & criminal casework', 'Prison visits & undertrial support', 'Courtroom representation'],
  },
  {
    id: 'rights',
    tag: 'Education',
    title: 'Rights Education',
    summary: 'Know Your Rights resources, downloadable legal guides, and community awareness camps across India.',
    image: rightsEducationPhoto,
    alt: 'Rights education and community awareness',
    objectPosition: 'center center',
    accent: '#2c4359',
    points: ['Know Your Rights resources', 'Downloadable legal guides', 'Community awareness camps'],
  },
  {
    id: 'advocacy',
    tag: 'Advocacy',
    title: 'Public-Interest Advocacy',
    summary: 'RTI drives, disability rights litigation, and systemic reform through fearless public-interest advocacy.',
    image: publicInterestPhoto,
    alt: 'Public-interest litigation and advocacy',
    objectPosition: 'center 22%',
    accent: '#a3566a',
    points: ['RTI & accountability drives', 'Disability rights litigation', 'Systemic reform'],
  },
  {
    id: 'outreach',
    tag: 'Outreach',
    title: 'Community Outreach',
    summary: 'On-ground legal aid camps, law student partnerships, and nationwide collaborations reaching citizens where they live.',
    image: communityOutreachPhoto,
    alt: 'Community legal aid outreach camps',
    objectPosition: 'center 35%',
    accent: '#4a6580',
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
      {/* Hero — full photo + left ivory gradient overlay (reference) */}
      <section className="home-hero">
        <div className="home-hero__body">
          <div className="home-hero__stage">
            <div className="home-hero__backdrop" aria-hidden="true">
              <img src={heroImage} alt="" className="home-hero__backdrop-img" />
              <div className="home-hero__backdrop-fade" />
            </div>

            <div className="container home-hero__content">
              <div className="home-hero__copy">
                <p className="home-hero__kicker">Radhey Krishna Legal Aid Foundation</p>
                <h1 className="home-hero__title">
                  Justice should never be a{' '}
                  <span className="home-hero__accent">privilege</span> reserved for the{' '}
                  <span className="home-hero__accent">few.</span>
                </h1>
                <p className="home-hero__lead">
                  A coalition of legal professionals and advocates protecting constitutional
                  rights — regardless of background or financial standing.
                </p>
                <div className="home-hero__actions">
                  <Link to="/donate" className="btn btn-primary btn-lg home-hero__btn-primary">
                    Support our work
                  </Link>
                  <Link to="/contact" className="btn btn-outline btn-lg home-hero__btn-outline">
                    Get in touch
                  </Link>
                </div>
                <p className="home-hero__tagline">
                  With You. For You.{' '}
                  <span className="home-hero__accent">Nyaya Tak.</span>
                </p>
              </div>
            </div>
          </div>

          <Reveal as="div" className="home-hero__stats" variant="up" delay={200}>
            <div className="container home-hero__stats-row">
              {introStats.map((stat) => (
                <article className="home-hero__stat" key={stat.label}>
                  <strong className="home-hero__stat-value">{stat.value}</strong>
                  <span className="home-hero__stat-label">{stat.label}</span>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why choose us — bento grid */}
      <section className="home-why">
        <div className="container">
          <Reveal as="header" className="home-section-head">
            <p className="home-kicker">Why choose us</p>
            <h2 className="home-section-title">
              Accessible justice is what every citizen deserves
            </h2>
            <p className="home-section-lead">
              Four pillars of fearless advocacy — from courtroom representation to grassroots outreach.
            </p>
          </Reveal>

          <div className="home-why__grid">
            {whyItems.map((item, index) => (
              <Reveal
                key={item.id}
                as="article"
                className="home-why-card"
                variant="up"
                delay={index * 90}
              >
                <div className="home-why-card__clip">
                  <div
                    className="home-why-card__visual"
                    style={{ '--photo-pos': item.objectPosition }}
                  >
                    <img src={item.image} alt={item.alt} loading="lazy" />
                  </div>
                  <div className="home-why-card__footer">
                    <h3>{item.title}</h3>
                    <span className="home-why-card__footer-line" aria-hidden="true" />
                  </div>
                  <div className="home-why-card__hover-panel">
                    <h3>{item.title}</h3>
                    <span className="home-why-card__hover-line" aria-hidden="true" />
                    <p>{item.summary}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About — dark editorial */}
      <Reveal as="section" className="home-about" variant="up">
        <div className="container">
          <div className="home-about__layout">
            <div className="home-about__visual">
              <div className="home-about__photo-ring" aria-hidden="true" />
              <div className="home-about__photo">
                <img src={father2Photo} alt="Adv. Ajay Garg, Chief Trustee, RKLAF" loading="lazy" />
              </div>
              <div className="home-about__badge">
                <span className="home-about__badge-num">2016</span>
                <span className="home-about__badge-text">Est.</span>
              </div>
            </div>

            <div className="home-about__copy">
              <p className="home-kicker home-kicker--light">About us</p>
              <h2 className="home-about__title">Rooted in service, driven by fearless advocacy</h2>
              <blockquote className="home-about__quote">
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
      </Reveal>

      {/* What we do */}
      <Reveal as="section" className="home-work" variant="up">
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
      </Reveal>

      <WhereWeWorkSection />

      {/* Resources + blog */}
      <Reveal as="section" className="home-dual" variant="up">
        <div className="container home-dual__grid">
          <article className="home-dual__panel home-dual__panel--dark">
            <div className="home-dual__panel-inner">
              <p className="home-kicker home-kicker--light">Resources</p>
              <h2>Learn. Research. Act.</h2>
              <ul className="home-dual__links">
                <li><Link to="/know-your-rights">Know Your Rights</Link></li>
                <li><Link to="/know-your-rights#guides">Downloadable Guides</Link></li>
                <li><Link to="/know-your-rights#emergency">Emergency Contacts</Link></li>
                <li><Link to="/contact#intake">Intake Procedure</Link></li>
                <li><Link to="/noted-judgments">Noted Judgments</Link></li>
                <li><Link to="/join">Join the Fight for Justice</Link></li>
              </ul>
            </div>
          </article>
          <article className="home-dual__panel home-dual__panel--accent">
            <div className="home-dual__panel-inner">
              <p className="home-kicker">From our blog</p>
              <h2>Stories from the field</h2>
              <p>Legal updates, camp recaps, and voices from advocates on the ground.</p>
              <Link to="/blogs" className="btn btn-secondary home-dual__blog-btn">
                View all blogs
              </Link>
            </div>
          </article>
        </div>
      </Reveal>

      <Reveal as="section" className="home-donate" variant="scale">
        <div className="home-donate__pattern" aria-hidden="true" />
        <div className="container home-donate__inner">
          <p className="home-kicker home-kicker--light">Support RKLAF</p>
          <h2>Stand with us for equal access to justice</h2>
          <p>Your contribution funds camps, casework, and free legal resources.</p>
          <div className="home-donate__actions">
            <Link to="/donate" className="btn btn-light btn-lg">Donate Now</Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg">Get in touch</Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
