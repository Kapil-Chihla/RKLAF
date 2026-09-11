import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGoogleAnalytics, trackPageView } from '../../lib/analytics';

/**
 * Loads GA4 when VITE_GA_MEASUREMENT_ID is set and sends a pageview
 * on every React Router navigation (SPA).
 */
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    trackPageView(path);
  }, [location.pathname, location.search]);

  return null;
}
