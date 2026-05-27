import { Link, useSearchParams } from 'react-router-dom';
import worldImage from '../assets/world.webp';
import ImpactMap from '../components/impact/ImpactMap';
import TornEdge from '../components/impact/TornEdge';
import './ImpactMapPage.css';

/**
 * Dedicated “Where We Work” page — layout inspired by
 * https://cfj.org/our-work/where-we-work/
 */
export default function ImpactMapPage() {
  const [params] = useSearchParams();
  const locationId = params.get('location');

  return (
    <div className="impact-page">
      <header
        className="impact-page__hero"
        style={{ backgroundImage: `url(${worldImage})` }}
      >
        <div className="impact-page__hero-overlay" aria-hidden="true" />
        <h1 className="impact-page__hero-title">Where We Work</h1>
        <TornEdge className="impact-page__torn" />
      </header>

      <section className="impact-page__intro">
        <div className="container impact-page__intro-grid">
          <p className="impact-page__intro-lead">
            Radhey Krishna Legal Aid Foundation advances justice by providing pro-bono legal
            support, rights education, and relentless advocacy across India and beyond.
          </p>
          <div className="impact-page__intro-body">
            <p>
              Through our programs — from Tihar undertrial support and community legal camps
              to national RTI drives and international collaborations — we challenge unjust
              laws, secure release for the wrongfully detained, and empower communities to
              defend their rights in court.
            </p>
            <p>
              Explore the interactive map below to see where we work and the type of legal
              aid we provide in each region.
            </p>
          </div>
        </div>
      </section>

      <section className="impact-page__map-zone" aria-label="Interactive map of our work">
        <ImpactMap variant="interactive" initialLocationId={locationId} />
      </section>

      <section className="impact-page__cta-band">
        <div className="container impact-page__cta-inner">
          <h2>Impact stories</h2>
          <p>
            Real cases, systemic reform, and community empowerment —{' '}
            <Link to="/our-work/programs" className="text-link">our programs</Link>
            {' · '}
            <Link to="/our-work/impact" className="text-link">areas we serve</Link>
            {' · '}
            <Link to="/contact" className="text-link">request legal support</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
