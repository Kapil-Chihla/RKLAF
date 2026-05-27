import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import mapImage from '../../assets/map.webp';
import './ImpactMap.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const EMPTY_FILTERS = { region: '', country: '', workType: '' };

export default function ImpactMap({
  variant = 'interactive',
  initialLocationId = null,
  overlay = null,
  className = '',
}) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ regions: [], countries: [], workTypes: [] });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPreview = variant === 'preview';
  const isInteractive = variant === 'interactive';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [locRes, filterRes] = await Promise.all([
        axios.get(`${API}/map-locations`),
        isInteractive ? axios.get(`${API}/map-locations/filters`) : Promise.resolve({ data: {} }),
      ]);
      setLocations(locRes.data);
      if (isInteractive) {
        setFilterOptions({
          regions: filterRes.data.regions || [],
          countries: filterRes.data.countries || [],
          workTypes: filterRes.data.workTypes || [],
        });
      }
    } catch {
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, [isInteractive]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!initialLocationId || !locations.length) return;
    const match = locations.find((l) => l.id === initialLocationId);
    if (match) setSelected(match);
  }, [initialLocationId, locations]);

  const filtered = useMemo(() => {
    return locations.filter((loc) => {
      if (filters.region && loc.region !== filters.region) return false;
      if (filters.country && loc.country !== filters.country) return false;
      if (filters.workType && loc.workType !== filters.workType) return false;
      return true;
    });
  }, [locations, filters]);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const handleMarkerClick = (loc, e) => {
    e.stopPropagation();
    if (isPreview) {
      navigate(`/our-work/impact?location=${loc.id}`);
      return;
    }
    setSelected(loc);
  };

  const handleFrameClick = () => {
    if (isPreview) navigate('/our-work/impact');
  };

  const filtersBar = isInteractive ? (
    <div className="impact-map__filters-inner container">
      <label>
        <span>Region</span>
        <select
          value={filters.region}
          onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
        >
          <option value="">Choose a region</option>
          {filterOptions.regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Country</span>
        <select
          value={filters.country}
          onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
        >
          <option value="">Choose a country</option>
          {filterOptions.countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Type of work</span>
        <select
          value={filters.workType}
          onChange={(e) => setFilters((f) => ({ ...f, workType: e.target.value }))}
        >
          <option value="">Choose a type</option>
          {filterOptions.workTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <button type="button" className="impact-map__clear" onClick={clearFilters}>
        Clear all
      </button>
    </div>
  ) : null;

  return (
    <div className={`impact-map impact-map--${variant} ${className}`.trim()}>
      {isInteractive && filtersBar}

      <div
        className="impact-map__frame"
        role={isPreview ? 'button' : undefined}
        tabIndex={isPreview ? 0 : undefined}
        onClick={isPreview ? handleFrameClick : undefined}
        onKeyDown={isPreview ? (e) => e.key === 'Enter' && handleFrameClick() : undefined}
      >
        <img src={mapImage} alt="Map of RKLAF work locations" className="impact-map__image" draggable={false} />

        {overlay && (
          <div className="impact-map__overlay" onClick={(e) => e.stopPropagation()}>
            {overlay}
          </div>
        )}

        {loading && <p className="impact-map__loading">Loading locations…</p>}

        {!loading && filtered.map((loc) => (
          <button
            key={loc.id}
            type="button"
            className={`impact-map__marker ${selected?.id === loc.id ? 'is-active' : ''}`}
            style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
            title={loc.name}
            aria-label={`${loc.name}: ${loc.workType}`}
            onClick={(e) => handleMarkerClick(loc, e)}
          >
            <span className="impact-map__marker-pulse" aria-hidden="true" />
            <span className="impact-map__marker-dot" aria-hidden="true" />
          </button>
        ))}

        {isInteractive && selected && (
          <div
            className="impact-map__popup"
            role="dialog"
            aria-labelledby="impact-popup-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="impact-map__popup-close"
              aria-label="Close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h3 id="impact-popup-title">{selected.name}</h3>
            <p className="impact-map__popup-type">{selected.workType}</p>
            {selected.summary && <p className="impact-map__popup-summary">{selected.summary}</p>}
            {selected.workItems?.length > 0 && (
              <div className="impact-map__popup-work">
                <strong>Our work:</strong>
                <ul>
                  {selected.workItems.map((item) => (
                    <li key={item.title}>
                      {item.url ? (
                        <Link to={item.url} onClick={() => setSelected(null)}>
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selected.overviewUrl && (
              <Link to={selected.overviewUrl} className="impact-map__popup-link">
                Read our overview of {selected.country || selected.name} →
              </Link>
            )}
          </div>
        )}

        {isPreview && !loading && filtered.length > 0 && (
          <p className="impact-map__hint">Click a pin · Tap map for full view</p>
        )}
      </div>

      {isInteractive && !loading && filtered.length === 0 && (
        <p className="impact-map__empty container">No locations match your filters.</p>
      )}
    </div>
  );
}
