import { Link } from 'react-router-dom';
import ImpactMap from './ImpactMap';
import './WhereWeWorkHome.css';

/**
 * Homepage block — full-width map with “Where We Work” overlaid (CFJ-style)
 */
export default function WhereWeWorkSection() {
  return (
    <section className="ww-home" aria-labelledby="ww-home-title">
      <div className="ww-home__stage">
        <ImpactMap variant="preview" className="ww-home__map" />

        <div className="ww-home__copy">
          <h2 id="ww-home-title" className="ww-home__title">
            Where
            <br />
            We Work
          </h2>
          <p className="ww-home__desc">
            RKLAF works across India and through international collaborations to deliver
            legal aid, rights education, and advocacy for every citizen.
          </p>
          <Link to="/our-work/impact" className="ww-home__cta">
            Where we work
          </Link>
        </div>
      </div>
    </section>
  );
}
