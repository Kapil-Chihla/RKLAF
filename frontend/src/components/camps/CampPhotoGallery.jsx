import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { assetUrl } from '../../lib/api';

export default function CampPhotoGallery({ images = [], title = '', variant = 'default' }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const photos = images.filter((img) => img?.url);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((current) => (current === null ? null : (current - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? null : (current + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrev]);

  if (!photos.length) {
    return (
      <div className="camp-gallery camp-gallery--empty">
        <p>No photos uploaded for this camp yet.</p>
      </div>
    );
  }

  const active = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className={`camp-gallery${variant === 'detail' ? ' camp-gallery--detail' : ''}`}>
        {photos.map((photo, index) => (
          <figure key={photo.id || photo.url} className="camp-gallery__item">
            <button
              type="button"
              className="camp-gallery__thumb"
              onClick={() => setActiveIndex(index)}
              aria-label={`View photo ${index + 1} of ${photos.length}`}
            >
              <img src={assetUrl(photo.url)} alt={photo.caption || title} loading="lazy" />
            </button>
            {photo.caption && <figcaption>{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {active && createPortal(
        <div className="camp-lightbox" onClick={close} role="presentation">
          <div
            className="camp-lightbox__panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo ${activeIndex + 1} of ${photos.length}`}
          >
            <button type="button" className="camp-lightbox__close" onClick={close} aria-label="Close">
              ×
            </button>
            {photos.length > 1 && (
              <>
                <button type="button" className="camp-lightbox__nav camp-lightbox__nav--prev" onClick={showPrev} aria-label="Previous photo">
                  ‹
                </button>
                <button type="button" className="camp-lightbox__nav camp-lightbox__nav--next" onClick={showNext} aria-label="Next photo">
                  ›
                </button>
              </>
            )}
            <img src={assetUrl(active.url)} alt={active.caption || title} />
            {active.caption && <p className="camp-lightbox__caption">{active.caption}</p>}
            <p className="camp-lightbox__counter">{activeIndex + 1} / {photos.length}</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
