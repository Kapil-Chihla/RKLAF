import { useEffect, useState } from 'react';
import publicApi from '../../lib/publicApi';
import './VisitMeter.css';

const SESSION_KEY = 'rklaf-visit-counted';

function formatCount(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-IN').format(n);
}

/** Sitewide visit meter — counts once per browser tab session. */
export default function VisitMeter() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const already = sessionStorage.getItem(SESSION_KEY) === '1';
        if (!already) {
          const { data } = await publicApi.post('/visits/hit');
          sessionStorage.setItem(SESSION_KEY, '1');
          if (!cancelled) setVisits(data?.visits ?? 0);
          return;
        }
        const { data } = await publicApi.get('/visits');
        if (!cancelled) setVisits(data?.visits ?? 0);
      } catch {
        try {
          const { data } = await publicApi.get('/visits');
          if (!cancelled) setVisits(data?.visits ?? 0);
        } catch {
          if (!cancelled) setVisits(null);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (visits == null) return null;

  return (
    <p className="visit-meter" aria-live="polite">
      <span className="visit-meter__label">Visitors</span>
      <span className="visit-meter__count">{formatCount(visits)}</span>
    </p>
  );
}
