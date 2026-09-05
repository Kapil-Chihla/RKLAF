import { useEffect, useState } from 'react';
import './SiteDisclaimer.css';

const STORAGE_KEY = 'rklaf-disclaimer-accepted-v1';

const DISCLAIMER_PARAS = [
  'The information on this website is provided by Radhey Krishna Legal Aid Foundation (RKLAF) for general awareness and educational purposes only. It does not constitute legal advice, a legal opinion, or an offer of representation.',
  'Every matter turns on its own facts. Visiting this site, reading its content, or submitting an enquiry does not by itself create an advocate–client relationship, nor does it guarantee legal representation or a particular outcome.',
  'While we take care to keep information accurate and useful, RKLAF does not warrant completeness or currency of all materials. For advice on your situation, please contact us through the channels provided so our team can review your request appropriately.',
  'Information shared with us is treated with appropriate confidentiality, subject to applicable law and RKLAF’s policies.',
];

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
        <p className="site-disclaimer__eyebrow">Important</p>
        <h2 id="site-disclaimer-title">Website disclaimer</h2>
        {DISCLAIMER_PARAS.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        <button type="button" className="site-disclaimer__btn" onClick={accept}>
          I understand →
        </button>
      </div>
    </div>
  );
}
