import { useEffect, useState } from 'react';
import { SITE_DISCLAIMER_PARAS } from '../../data/legalPages';
import './SiteDisclaimer.css';

const STORAGE_KEY = 'rklaf-disclaimer-accepted-v2';

export default function SiteDisclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    setOpen(true);
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="site-disclaimer" role="dialog" aria-modal="true" aria-labelledby="site-disclaimer-title">
      <div className="site-disclaimer__panel">
        <p className="site-disclaimer__eyebrow">Important disclaimer</p>
        <h2 id="site-disclaimer-title">Before you continue</h2>
        {SITE_DISCLAIMER_PARAS.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        <button type="button" className="site-disclaimer__btn" onClick={accept}>
          I Acknowledge &amp; Continue
        </button>
      </div>
    </div>
  );
}
