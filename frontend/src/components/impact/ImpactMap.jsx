import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import mapImage from '../../assets/map.webp';
import MapLocationModal from './MapLocationModal';
import './ImpactMap.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://rklaf.onrender.com/api';

const EMPTY_FILTERS = { region: '', country: '', workType: '' };

/** Shown on the homepage when the API is unavailable */
const PREVIEW_FALLBACK_LOCATIONS = [
  { id: 'delhi', name: 'Delhi NCR', workType: 'Legal aid camps', mapX: 62, mapY: 42 },
  { id: 'mumbai', name: 'Mumbai', workType: 'Rights education', mapX: 58, mapY: 52 },
  { id: 'rural', name: 'Rural outreach', workType: 'Community camps', mapX: 55, mapY: 48 },
];

export default function ImpactMap({
  variant = 'interactive',
  initialLocationId = null,
  overlay = null,
  className = '',
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ regions: [], countries: [], workTypes: [] });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
      setLocations(isPreview ? PREVIEW_FALLBACK_LOCATIONS : []);
    } finally {
      setLoading(false);
    }
  }, [isInteractive, isPreview]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!initialLocationId || !locations.length) return;
    const match = locations.find((l) => l.id === initialLocationId);
    if (match) setSelectedId(match.id);
  }, [initialLocationId, locations]);

  const filtered = useMemo(() => {
    return locations.filter((loc) => {
      if (filters.region && loc.region !== filters.region) return false;
      if (filters.country && loc.country !== filters.country) return false;
      if (filters.workType && loc.workType !== filters.workType) return false;
      return true;
    });
  }, [locations, filters]);

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedId) ?? null,
    [locations, selectedId],
  );

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const closeLocation = useCallback(() => {
    setSelectedId(null);
    if (isInteractive && searchParams.has('location')) {
      setSearchParams({}, { replace: true });
    }
  }, [isInteractive, searchParams, setSearchParams]);

  const openLocation = useCallback((id) => {
    setSelectedId(id);
    if (isInteractive) {
      setSearchParams({ location: id }, { replace: true });
    }
  }, [isInteractive, setSearchParams]);

  const handleMarkerClick = (loc, event) => {
    event.stopPropagation();
    if (selectedId === loc.id) {
      closeLocation();
      return;
    }
    openLocation(loc.id);
  };

  const handleFrameClick = () => {
    if (selectedId) {
      closeLocation();
      return;
    }
    if (isPreview) {
      navigate('/our-work/impact');
    }
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
        onClick={handleFrameClick}
        onKeyDown={isPreview ? (e) => e.key === 'Enter' && handleFrameClick() : undefined}
      >
        <img
          src={mapImage}
          alt="Map of RKLAF work locations"
          className="impact-map__image"
          draggable={false}
          width={3000}
          height={1705}
          onError={() => setImageError(true)}
        />

        {imageError && (
          <p className="impact-map__loading">Map image unavailable</p>
        )}

        {overlay && (
          <div className="impact-map__overlay" onClick={(e) => e.stopPropagation()}>
            {overlay}
          </div>
        )}

        {loading && <p className="impact-map__loading">Loading locations…</p>}

        {!loading && filtered.map((loc) => {
          const isSelected = selectedId === loc.id;

          return (
            <div
              key={loc.id}
              className={`impact-map__marker-group ${isSelected ? 'is-active is-pinned' : ''}`}
              style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
            >
              <button
                type="button"
                className="impact-map__marker"
                aria-label={`${loc.name}: ${loc.workType}`}
                aria-expanded={isSelected}
                onClick={(event) => handleMarkerClick(loc, event)}
              >
                <span className="impact-map__marker-pulse" aria-hidden="true" />
                <span className="impact-map__marker-dot" aria-hidden="true" />
              </button>
            </div>
          );
        })}

        {isPreview && !loading && filtered.length > 0 && (
          <p className="impact-map__hint">Click a pin for details · Tap map for full view</p>
        )}

        {isInteractive && !loading && filtered.length > 0 && (
          <p className="impact-map__hint impact-map__hint--interactive">Click a pin for details</p>
        )}
      </div>

      {isInteractive && !loading && filtered.length === 0 && (
        <p className="impact-map__empty container">No locations match your filters.</p>
      )}

      <MapLocationModal loc={selectedLocation} onClose={closeLocation} />
    </div>
  );
}
