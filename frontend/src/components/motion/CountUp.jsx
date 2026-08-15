import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function formatNumber(n, { decimals = 0, locale = 'en-US' } = {}) {
  if (decimals > 0) {
    return n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return Math.round(n).toLocaleString(locale);
}

/**
 * Counts from 0 → end when the element enters the viewport (once).
 * Respects prefers-reduced-motion.
 */
export default function CountUp({
  end,
  duration = 1600,
  suffix = '',
  prefix = '',
  decimals = 0,
  locale = 'en-US',
  className = '',
  as: Tag = 'strong',
  threshold = 0.4,
  rootMargin = '0px 0px -8% 0px',
  startOnMount = false,
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (startOnMount) {
      setActive(true);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, startOnMount, threshold]);

  useEffect(() => {
    if (!active) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(end);
      return undefined;
    }

    let raf = 0;
    let start = 0;

    const tick = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      setDisplay(end * easeOutCubic(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(end);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);

  return (
    <Tag ref={ref} className={className}>
      {prefix}
      {formatNumber(display, { decimals, locale })}
      {suffix}
    </Tag>
  );
}
