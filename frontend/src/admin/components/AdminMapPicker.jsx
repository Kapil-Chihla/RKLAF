import mapImage from '../../assets/map.webp';
import './AdminMapPicker.css';

export default function AdminMapPicker({
  mapX,
  mapY,
  onPlace,
  otherMarkers = [],
  editingId = null,
}) {
  const hasPin = mapX !== '' && mapY !== '' && mapX != null && mapY != null;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPlace(
      Math.round(Math.min(98, Math.max(2, x)) * 10) / 10,
      Math.round(Math.min(96, Math.max(4, y)) * 10) / 10
    );
  };

  return (
    <div className="admin-map-picker">
      <p className="admin-map-picker__hint">
        Click on the map to place the pin. Existing locations are shown as faint dots.
      </p>
      <div
        className="admin-map-picker__frame"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
        role="presentation"
      >
        <img
          src={mapImage}
          alt="World map — click to place pin"
          className="admin-map-picker__image"
          draggable={false}
        />

        {otherMarkers
          .filter((loc) => loc.id !== editingId && loc.mapX != null && loc.mapY != null)
          .map((loc) => (
            <span
              key={loc.id}
              className="admin-map-picker__marker admin-map-picker__marker--other"
              style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
              title={loc.name}
            />
          ))}

        {hasPin && (
          <span
            className="admin-map-picker__marker admin-map-picker__marker--active"
            style={{ left: `${mapX}%`, top: `${mapY}%` }}
            title="Selected location"
          />
        )}
      </div>

      {hasPin && (
        <p className="admin-map-picker__coords">
          Pin at <strong>{mapX}%</strong> horizontal, <strong>{mapY}%</strong> vertical
        </p>
      )}
    </div>
  );
}
