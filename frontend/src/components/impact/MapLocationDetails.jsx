import { Link } from 'react-router-dom';

export function MapLocationDetails({ loc, titleId }) {
  if (!loc) return null;

  return (
    <>
      <h3 id={titleId}>{loc.name}</h3>
      {loc.workType && <p className="impact-map__location-type">{loc.workType}</p>}
      {(loc.region || loc.country) && (
        <p className="impact-map__location-meta">
          {[loc.region, loc.country].filter(Boolean).join(' · ')}
        </p>
      )}
      {loc.summary && <p className="impact-map__location-summary">{loc.summary}</p>}
      {loc.workItems?.length > 0 && (
        <div className="impact-map__location-work">
          <strong>Our work:</strong>
          <ul>
            {loc.workItems.map((item) => (
              <li key={item.title}>
                {item.url ? (
                  <Link to={item.url}>{item.title}</Link>
                ) : (
                  item.title
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {loc.overviewUrl && (
        <Link to={loc.overviewUrl} className="impact-map__location-link">
          Read our overview of {loc.country || loc.name} →
        </Link>
      )}
    </>
  );
}
