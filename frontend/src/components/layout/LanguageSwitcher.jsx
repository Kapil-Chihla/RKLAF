import { useEffect, useId, useRef, useState } from 'react';
import {
  SITE_LANGUAGES,
  applySiteLanguage,
  ensureGoogleTranslate,
  getSavedLanguage,
} from '../../lib/siteLanguage';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    setCurrent(getSavedLanguage());
    ensureGoogleTranslate();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = SITE_LANGUAGES.find((l) => l.code === current) || SITE_LANGUAGES[0];

  const pick = (code) => {
    setOpen(false);
    if (code === current) return;
    applySiteLanguage(code);
  };

  return (
    <div className={`lang-switch ${compact ? 'lang-switch--compact' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="lang-switch__btn notranslate"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        title="Change language"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-switch__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" />
          </svg>
        </span>
        <span className="lang-switch__label">{active.native}</span>
        <span className="lang-switch__chev" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <ul id={listId} className="lang-switch__menu notranslate" role="listbox" aria-label="Languages">
          {SITE_LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === current}>
              <button
                type="button"
                className={lang.code === current ? 'is-active' : ''}
                onClick={() => pick(lang.code)}
              >
                <span className="lang-switch__native">{lang.native}</span>
                <span className="lang-switch__en">{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
