import { Link } from 'react-router-dom';
import WhereWeWorkSection from '../components/impact/WhereWeWorkSection';
import './Home.css';

const impactStats = [
  { value: '3,100+', label: 'People Engaged', sub: 'Across legal camps & outreach' },
  { value: '98%', label: 'Rights Awareness', sub: 'Reported after our sessions' },
  { value: '40+', label: 'Camps Conducted', sub: 'On-ground legal aid drives' },
];

const recentCamps = [
  { title: 'Delhi Legal Camp', location: 'Community Centre, Delhi', tag: 'Camp Recap' },
  { title: 'Mumbai Rights Drive', location: 'Mumbai, Maharashtra', tag: 'Camp Recap' },
  { title: 'Rural Outreach Week', location: 'Uttar Pradesh', tag: 'Read More' },
];

const focusAreas = [
  { title: 'Civil Law', desc: 'Property, family, and contractual disputes.', path: '/our-work/impact' },
  { title: 'Criminal Defense', desc: 'Fair representation and procedural guidance.', path: '/our-work/impact' },
  { title: 'Human Rights', desc: 'Protection of dignity, liberty, and equality.', path: '/know-your-rights' },
];

const ourWorkLinks = [
  { label: 'Programs & Initiatives', path: '/our-work/programs' },
  { label: 'Our Impact', path: '/our-work/impact' },
];

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__texture" aria-hidden="true" />
        <div className="container home-hero__inner">
          <p className="home-label">Radhey Krishna Legal Aid Foundation</p>
          <h1 className="home-hero__title">WITH YOU. FOR YOU. NYAYA TAK.</h1>
          <p className="home-hero__mission">
            Our mandate is to democratize access to justice — pro-bono legal support, rights
            education, and relentless advocacy for every citizen.
          </p>
          <div className="home-hero__actions">
            <Link to="/donate" className="btn btn-outline btn-lg home-hero__donate">Donate</Link>
            <Link to="/about" className="btn btn-primary btn-lg">About RKLAF</Link>
          </div>
        </div>
      </section>

      <section className="home-impact">
        <div className="container">
          <h2 className="home-section-title home-section-title--center">OUR IMPACT</h2>
          <div className="impact-grid">
            {impactStats.map((stat) => (
              <article key={stat.label} className="impact-card">
                <span className="impact-card__value">{stat.value}</span>
                <span className="impact-card__label">{stat.label}</span>
                <span className="impact-card__sub">{stat.sub}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WhereWeWorkSection />

      <section className="home-camps">
        <div className="container">
          <div className="home-section-head">
            <h2 className="home-section-title">RECENT CAMPS</h2>
            <Link to="/our-work/programs" className="home-link-arrow">See all programs</Link>
          </div>
          <div className="camp-grid">
            {recentCamps.map((camp) => (
              <article key={camp.title} className="camp-card">
                <div className="camp-card__visual" aria-hidden="true">
                  <span className="camp-card__initial">{camp.title.charAt(0)}</span>
                </div>
                <div className="camp-card__body">
                  <span className="camp-card__tag">{camp.tag}</span>
                  <h3>{camp.title}</h3>
                  <p>{camp.location}</p>
                  <Link to="/our-work/programs#gallery" className="text-link">View gallery →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-pillars">
        <div className="container">
          <h2 className="home-section-title home-section-title--center">WHAT WE DO</h2>
          <p className="home-section-lead">
            From grassroots camps to structured casework — building a fairer legal landscape.
          </p>
          <div className="pillar-grid">
            {focusAreas.map((area) => (
              <Link key={area.title} to={area.path} className="pillar-card pillar-card--link">
                <div className="pillar-card__accent" />
                <h3>{area.title}</h3>
                <p>{area.desc}</p>
                <span className="pillar-card__arrow">Learn more →</span>
              </Link>
            ))}
          </div>
          <div className="home-pillars__links">
            {ourWorkLinks.map((link) => (
              <Link key={link.path} to={link.path} className="home-pillar-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-split">
        <div className="container home-split__grid">
          <article className="home-split__panel home-split__panel--story">
            <p className="home-label">About Us</p>
            <h2>Rooted in service since 2016</h2>
            <p>
              Established to honor Late Sh. R.S. Garg and Smt. Krishna Garg — carrying forward
              a legacy of accessible, fearless advocacy under Adv. Ajay Garg.
            </p>
            <Link to="/about" className="btn btn-primary">Read our story</Link>
          </article>
          <article className="home-split__panel home-split__panel--hub">
            <p className="home-label">Know Your Rights</p>
            <h2>Learn. Research. Act.</h2>
            <ul className="home-quick-links">
              <li><Link to="/know-your-rights">Know Your Rights</Link></li>
              <li><Link to="/know-your-rights#intake">Intake Procedure</Link></li>
              <li><Link to="/know-your-rights#noted-judgments">Noted Judgments</Link></li>
              <li><Link to="/blogs">Blogs & Research</Link></li>
              <li><Link to="/join">Join the Fight for Justice</Link></li>
            </ul>
          </article>
        </div>
      </section>

      <section className="home-blogs">
        <div className="container home-blogs__inner">
          <div>
            <h2 className="home-section-title">FROM OUR BLOG</h2>
            <p>Stories, legal updates, and voices from the field.</p>
          </div>
          <Link to="/blogs" className="btn btn-secondary">View all blogs</Link>
        </div>
      </section>

      <section className="home-donate">
        <div className="container home-donate__inner">
          <h2>Stand with us for equal access to justice</h2>
          <p>Your contribution funds camps, casework, and free legal resources.</p>
          <div className="home-donate__actions">
            <Link to="/donate" className="btn btn-light btn-lg">Donate Now</Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
