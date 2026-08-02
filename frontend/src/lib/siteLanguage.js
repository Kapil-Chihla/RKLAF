/** Major Indian languages supported by Google Translate (+ English). */
export const SITE_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
];

const STORAGE_KEY = 'rklaf_lang';
const SCRIPT_ID = 'google-translate-script';

function readCookieLang() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
  return match?.[1] || 'en';
}

export function getSavedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) || readCookieLang() || 'en';
  } catch {
    return readCookieLang() || 'en';
  }
}

function setGoogTransCookie(lang) {
  const host = window.location.hostname;
  const value = lang === 'en' ? '' : `/en/${lang}`;
  // Clear then set for current host + root domain variants
  const clear = `googtrans=;path=/;max-age=0`;
  document.cookie = clear;
  document.cookie = `${clear};domain=${host}`;
  if (value) {
    document.cookie = `googtrans=${value};path=/`;
    document.cookie = `googtrans=${value};path=/;domain=${host}`;
  }
}

/**
 * Apply language via Google Translate cookie + soft reload.
 * Reload is required for reliable SPA coverage.
 */
export function applySiteLanguage(lang) {
  const code = SITE_LANGUAGES.some((l) => l.code === lang) ? lang : 'en';
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
  setGoogTransCookie(code);
  window.location.reload();
}

let scriptPromise = null;

export function ensureGoogleTranslate() {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    window.googleTranslateElementInit = () => {
      try {
        // eslint-disable-next-line no-new
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: SITE_LANGUAGES.map((l) => l.code).join(','),
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element',
        );
      } catch {
        /* element may already exist */
      }
      resolve();
    };

    if (document.getElementById(SCRIPT_ID)) {
      if (window.google?.translate?.TranslateElement) {
        window.googleTranslateElementInit();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });

  return scriptPromise;
}
