import { useState } from 'react';
import { SITE_DISCLAIMER_PARAS } from '../../data/legalPages';
import logoMark from '../../assets/logo-mark.png';
import './SiteDisclaimer.css';

/** Shows on every full page load / refresh. Stays dismissed only until the next reload (SPA navigations keep Layout mounted). */
export default function SiteDisclaimer() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="site-disclaimer" role="dialog" aria-modal="true" aria-labelledby="site-disclaimer-title">
      <div className="site-disclaimer__panel">
        <img
          src={logoMark}
          alt="Radhey Krishna Legal Aid Foundation"
          className="site-disclaimer__logo"
          width={72}
          height={72}
        />
        <p className="site-disclaimer__eyebrow">Important disclaimer</p>
        <h2 id="site-disclaimer-title">Before you continue</h2>
        {SITE_DISCLAIMER_PARAS.map((p) => (
          <p key={p.slice(0, 48)} className="site-disclaimer__body">{p}</p>
        ))}
        <button type="button" className="site-disclaimer__btn" onClick={() => setOpen(false)}>
          I Acknowledge &amp; Continue
        </button>
      </div>
    </div>
  );
}
