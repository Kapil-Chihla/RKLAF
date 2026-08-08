import { useEffect, useRef, useState } from 'react';
import './PdfPreviewModal.css';

/**
 * Full-screen PDF preview modal.
 * Fetches the PDF as a blob (works with our Cloudinary-proxied API) and shows it
 * in an iframe so the browser’s built-in viewer provides zoom, page nav, thumbnails,
 * download, and print — matching Chrome’s PDF UI.
 */
export default function PdfPreviewModal({ title, viewUrl, downloadUrl, onClose }) {
  const iframeRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const candidates = [viewUrl, downloadUrl].filter((u) => u && u !== '#');
    // Prefer download URL first — always deployed; /view is newer and may 404 on older hosts
    const ordered = [
      ...candidates.filter((u) => /\/download\/?$/.test(u) || u.includes('/download')),
      ...candidates.filter((u) => !(/\/download\/?$/.test(u) || u.includes('/download'))),
    ];
    // de-dupe while preserving order
    const urls = [...new Set(ordered.length ? ordered : candidates)];

    if (!urls.length) {
      setError('No PDF available for this guide.');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let objectUrl = null;
    setLoading(true);
    setError('');
    setBlobUrl(null);

    (async () => {
      let lastErr = 'Could not load PDF';
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            let msg = `Could not load PDF (${res.status})`;
            try {
              const data = await res.json();
              if (data?.message) msg = data.message;
            } catch {
              /* ignore */
            }
            lastErr = msg;
            continue;
          }
          const blob = await res.blob();
          if (cancelled) return;
          const typed =
            blob.type === 'application/pdf' || blob.type === 'application/octet-stream' || !blob.type
              ? new Blob([blob], { type: 'application/pdf' })
              : blob.type.includes('pdf')
                ? blob
                : new Blob([blob], { type: 'application/pdf' });
          objectUrl = URL.createObjectURL(typed);
          setBlobUrl(objectUrl);
          setLoading(false);
          return;
        } catch (err) {
          lastErr = err.message || 'Failed to load PDF';
        }
      }
      if (!cancelled) {
        setError(lastErr);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [viewUrl, downloadUrl]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const iframeSrc = blobUrl
    ? `${blobUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=${zoom}`
    : null;

  const zoomOut = () => setZoom((z) => Math.max(50, z - 10));
  const zoomIn = () => setZoom((z) => Math.min(200, z + 10));
  const zoomReset = () => setZoom(100);

  const handlePrint = () => {
    try {
      iframeRef.current?.contentWindow?.print();
    } catch {
      if (blobUrl) window.open(blobUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="pdf-preview"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'PDF preview'}
      onClick={onClose}
    >
      <div className="pdf-preview__panel" onClick={(e) => e.stopPropagation()}>
        <header className="pdf-preview__head">
          <h2 className="pdf-preview__title" title={title}>
            {title || 'Practical guide'}
          </h2>
          <button type="button" className="pdf-preview__close" aria-label="Close preview" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="pdf-preview__toolbar" role="toolbar" aria-label="PDF tools">
          <div className="pdf-preview__zoom">
            <button type="button" onClick={zoomOut} aria-label="Zoom out" disabled={!blobUrl}>
              −
            </button>
            <span aria-live="polite">{zoom}%</span>
            <button type="button" onClick={zoomIn} aria-label="Zoom in" disabled={!blobUrl}>
              +
            </button>
            <button type="button" className="pdf-preview__tool-text" onClick={zoomReset} disabled={!blobUrl}>
              Fit
            </button>
          </div>
          <div className="pdf-preview__actions">
            {downloadUrl && downloadUrl !== '#' ? (
              <a
                className="pdf-preview__btn"
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 4v10M8 10l4 4 4-4" />
                  <path d="M5 18h14" />
                </svg>
                Download
              </a>
            ) : null}
            <button type="button" className="pdf-preview__btn" onClick={handlePrint} disabled={!blobUrl}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 9V3h12v6" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <path d="M6 14h12v7H6z" />
              </svg>
              Print
            </button>
            {blobUrl ? (
              <a
                className="pdf-preview__btn pdf-preview__btn--ghost"
                href={blobUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open tab
              </a>
            ) : null}
          </div>
        </div>

        <div className="pdf-preview__body">
          {loading ? (
            <p className="pdf-preview__status">Loading PDF…</p>
          ) : error ? (
            <div className="pdf-preview__status pdf-preview__status--error">
              <p>{error}</p>
              {downloadUrl && downloadUrl !== '#' ? (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  Download instead →
                </a>
              ) : null}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              className="pdf-preview__frame"
              src={iframeSrc}
              title={title || 'PDF preview'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
