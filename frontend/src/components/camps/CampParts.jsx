import { Link } from 'react-router-dom';
import { campPhotoCount, campSummary, formatCampDate, getCampHero } from '../../lib/campUtils';

export function CampMeta({ camp }) {
  const date = formatCampDate(camp.date || camp.createdAt);
  const location = camp.location?.trim();

  if (!date && !location) return null;

  return (
    <p className="camp-meta">
      {date && <time dateTime={camp.date || camp.createdAt}>{date}</time>}
      {date && location && <span className="camp-meta__dot" aria-hidden="true">·</span>}
      {location && <span>{location}</span>}
    </p>
  );
}

export function CampCard({ camp, index = 0 }) {
  const hero = getCampHero(camp);
  const summary = campSummary(camp);
  const photos = campPhotoCount(camp);

  return (
    <Link
      to={`/our-work/programs/camps/${camp.slug || camp.id}`}
      className="camp-card camps-reveal is-visible"
      style={{ '--card-i': index }}
    >
      <div className="camp-card__frame">
        {hero ? (
          <img src={hero} alt="" loading="lazy" />
        ) : (
          <div className="camp-card__placeholder" aria-hidden="true">
            <span>RKLAF</span>
          </div>
        )}
        {photos > 1 && (
          <span className="camp-card__count">{photos} photos</span>
        )}
      </div>
      <div className="camp-card__body">
        {camp.tags?.[0] && <span className="camp-card__tag">{camp.tags[0]}</span>}
        <CampMeta camp={camp} />
        <h2 className="camp-card__title">{camp.title}</h2>
        {summary && <p className="camp-card__summary">{summary}</p>}
        <span className="camp-card__cta">View camp album →</span>
      </div>
    </Link>
  );
}

export function CampSkeletonGrid() {
  return (
    <div className="camps-grid camps-grid--loading" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <div key={n} className="camp-skeleton">
          <div className="camp-skeleton__media" />
          <div className="camp-skeleton__body">
            <div className="camp-skel-line camp-skel-line--short" />
            <div className="camp-skel-line camp-skel-line--title" />
            <div className="camp-skel-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
