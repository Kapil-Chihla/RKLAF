import { useEffect, useRef, useState } from 'react';
import sketchSrc from '../../assets/herosketch.jpeg';

/**
 * Reliable draw-on-load: crisp JPEG revealed L→R via CSS mask.
 * No ghost/blur image. No canvas threshold (which failed on light grey ink).
 * Survives React Strict Mode remounts via a generation token.
 */
export default function HeroSketch({
  className = '',
  alt = 'Line sketch of advocates and community members in conversation',
}) {
  const wrapRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | drawing | done
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    if (reducedMotion) {
      el.style.setProperty('--draw', '100%');
      setPhase('done');
      return undefined;
    }

    let alive = true;
    let raf = 0;
    const duration = 2800;
    let start = 0;

    el.style.setProperty('--draw', '0%');
    setPhase('drawing');

    const tick = (now) => {
      if (!alive) return;
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      // Ease-out so early strokes feel faster
      const eased = 1 - (1 - t) ** 3;
      const pct = `${(eased * 100).toFixed(2)}%`;
      el.style.setProperty('--draw', pct);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        el.style.setProperty('--draw', '100%');
        setPhase('done');
      }
    };

    // Double rAF: wait until after layout/paint (fixes Strict Mode + first-frame races)
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(tick);
    });

    // Safety: never leave a half-drawn state
    const failSafe = window.setTimeout(() => {
      if (!alive) return;
      el.style.setProperty('--draw', '100%');
      setPhase('done');
    }, duration + 800);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(failSafe);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className={`hero-sketch hero-sketch--${phase} ${className}`.trim()}
      style={{ '--draw': '0%' }}
    >
      <img
        src={sketchSrc}
        alt={alt}
        className="hero-sketch__img"
        decoding="async"
        fetchPriority="high"
        width={1536}
        height={1024}
        draggable={false}
      />
    </div>
  );
}
