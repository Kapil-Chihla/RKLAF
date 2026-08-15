import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Load a rights-deck PDF once; expose pdf.js document for single-page rendering.
 */
export function useDeckPdfDocument(viewHref, downloadHref, enabled) {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled) {
      setPdf(null);
      setNumPages(0);
      setLoading(false);
      setError('');
      return undefined;
    }

    const candidates = [viewHref, downloadHref].filter((u) => u && u !== '#');
    const ordered = [
      ...candidates.filter((u) => /\/download\/?$/.test(u) || u.includes('/download')),
      ...candidates.filter((u) => !(/\/download\/?$/.test(u) || u.includes('/download'))),
    ];
    const urls = [...new Set(ordered.length ? ordered : candidates)];
    if (!urls.length) {
      setError('No PDF available');
      setPdf(null);
      setNumPages(0);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let loaded = null;
    setLoading(true);
    setError('');
    setPdf(null);
    setNumPages(0);

    (async () => {
      let lastErr = 'Could not load PDF';
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            lastErr = `Could not load PDF (${res.status})`;
            continue;
          }
          const data = await res.arrayBuffer();
          if (cancelled) return;
          const task = pdfjs.getDocument({ data });
          loaded = await task.promise;
          if (cancelled) {
            loaded.destroy();
            return;
          }
          setPdf(loaded);
          setNumPages(loaded.numPages || 0);
          setLoading(false);
          return;
        } catch (err) {
          lastErr = err?.message || 'Failed to load PDF';
        }
      }
      if (!cancelled) {
        setError(lastErr);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (loaded) {
        try {
          loaded.destroy();
        } catch {
          /* ignore */
        }
      }
    };
  }, [viewHref, downloadHref, enabled]);

  return { pdf, numPages, loading, error };
}

function isRenderCancel(err) {
  return (
    err?.name === 'RenderingCancelledException' ||
    /cancel/i.test(String(err?.message || ''))
  );
}

/**
 * One PDF page, object-fit: contain inside the stage (no crop, no vertical scroll).
 * Uses a fresh canvas per page and serializes render tasks.
 */
export default function DeckPdfSlide({ pdf, pageNumber, title }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const busyRef = useRef(false);
  const pendingRef = useRef(false);
  const [renderError, setRenderError] = useState('');
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!pdf || !pageNumber) return undefined;

    let alive = true;
    let resizeTimer = null;

    const cancelActive = async () => {
      const task = renderTaskRef.current;
      renderTaskRef.current = null;
      if (!task) return;
      try {
        task.cancel();
      } catch {
        /* ignore */
      }
      try {
        await task.promise;
      } catch {
        /* cancelled */
      }
    };

    const paint = async () => {
      if (!alive) return;
      if (busyRef.current) {
        pendingRef.current = true;
        return;
      }

      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      busyRef.current = true;
      pendingRef.current = false;
      setRendering(true);
      setRenderError('');

      try {
        await cancelActive();
        if (!alive) return;

        const page = await pdf.getPage(pageNumber);
        if (!alive) return;

        // Inset so device pixel rounding never clips edges
        const inset = 8;
        const availW = Math.max(1, wrap.clientWidth - inset * 2);
        const availH = Math.max(1, wrap.clientHeight - inset * 2);
        const base = page.getViewport({ scale: 1 });
        const fit = Math.min(availW / base.width, availH / base.height);
        const viewport = page.getViewport({ scale: Math.max(fit, 0.05) });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cssW = Math.floor(viewport.width);
        const cssH = Math.floor(viewport.height);
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) throw new Error('Canvas unavailable');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cssW, cssH);

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
        if (renderTaskRef.current === task) renderTaskRef.current = null;
      } catch (err) {
        if (!alive || isRenderCancel(err)) return;
        setRenderError(err?.message || 'Could not render page');
      } finally {
        busyRef.current = false;
        if (alive) setRendering(false);
        if (alive && pendingRef.current) {
          pendingRef.current = false;
          paint();
        }
      }
    };

    // Wait a frame so layout has settled (banner → slide swap, resize)
    const boot = window.requestAnimationFrame(() => {
      paint();
    });

    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (alive) paint();
      }, 160);
    };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (wrapRef.current) ro?.observe(wrapRef.current);
    window.addEventListener('orientationchange', onResize);

    return () => {
      alive = false;
      window.cancelAnimationFrame(boot);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      ro?.disconnect();
      window.removeEventListener('orientationchange', onResize);
      cancelActive();
    };
  }, [pdf, pageNumber]);

  return (
    <div ref={wrapRef} className="kyr-deck-stage__page-frame" aria-busy={rendering}>
      <canvas
        ref={canvasRef}
        className="kyr-deck-stage__page-canvas"
        title={title || `Page ${pageNumber}`}
        hidden={Boolean(renderError)}
      />
      {renderError ? (
        <p className="kyr-deck-stage__pdf-status kyr-deck-stage__pdf-status--error">{renderError}</p>
      ) : null}
    </div>
  );
}
