const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function isAnalyticsEnabled() {
  return Boolean(MEASUREMENT_ID) && typeof window !== 'undefined';
}

export function getMeasurementId() {
  return MEASUREMENT_ID || '';
}

/** Load gtag.js once and configure GA4. Safe to call repeatedly. */
export function initGoogleAnalytics() {
  if (!isAnalyticsEnabled() || window.__rklafGaInitialized) return;

  const id = MEASUREMENT_ID;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    send_page_view: false,
    anonymize_ip: true,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.__rklafGaInitialized = true;
}

/** SPA pageview — call on every client-side route change. */
export function trackPageView(path, title = document.title) {
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') return;
  if (path.startsWith('/admin')) return;

  window.gtag('config', MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
