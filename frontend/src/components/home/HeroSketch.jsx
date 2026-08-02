import { useEffect, useRef, useState } from 'react';
import sketchSrc from '../../assets/herosketch.jpeg';

/**
 * Sketch reveal that always looks like a drawing in progress:
 * the real illustration is unveiled left → right with a soft pencil edge.
 * Never scattered fragments (those came from broken path-tracing).
 */
export default function HeroSketch({
  className = '',
  alt = 'Line sketch of advocates and community members in conversation',
}) {
  const wrapRef = useRef(null);
  const [phase, setPhase] = useState('idle');
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
    const duration = 4200;
    let start = 0;

    el.style.setProperty('--draw', '0%');
    setPhase('drawing');

    // Ease-out: starts deliberate, then covers ground — like a hand sketching
    const ease = (t) => 1 - (1 - t) ** 2.6;

    const tick = (now) => {
      if (!alive) return;
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      el.style.setProperty('--draw', `${(ease(t) * 100).toFixed(2)}%`);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        el.style.setProperty('--draw', '100%');
        setPhase('done');
      }
    };

    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(tick);
    });

    const failSafe = window.setTimeout(() => {
      if (!alive) return;
      el.style.setProperty('--draw', '100%');
      setPhase('done');
    }, duration + 700);

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
