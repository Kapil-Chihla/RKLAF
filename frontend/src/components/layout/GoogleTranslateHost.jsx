import { useEffect } from 'react';
import { ensureGoogleTranslate } from '../../lib/siteLanguage';

/** Hidden Google Translate mount point — required for the language switcher. */
export default function GoogleTranslateHost() {
  useEffect(() => {
    ensureGoogleTranslate();
  }, []);

  return <div id="google_translate_element" aria-hidden="true" />;
}
