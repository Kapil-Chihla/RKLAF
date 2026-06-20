import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapLocationDetails } from './MapLocationDetails';

export default function MapLocationModal({ loc, onClose }) {
  useEffect(() => {
    if (!loc) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loc, onClose]);

  if (!loc) return null;

  return createPortal(
    <div className="impact-map-modal" onClick={onClose}>
      <div
        className="impact-map-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="impact-map-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="impact-map-modal__close"
          onClick={onClose}
          aria-label="Close location details"
        >
          <span aria-hidden="true">×</span>
        </button>
        <MapLocationDetails loc={loc} titleId="impact-map-modal-title" />
      </div>
    </div>,
    document.body,
  );
}
