import { useEffect, useRef } from 'react';
import heroVideoSrc from '../../assets/IMG_9334.mp4';

/**
 * Hero media — autoplays muted once. No loop, no controls.
 */
export default function HeroVideo({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const tryPlay = () => {
      if (el.ended) return;
      el.muted = true;
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    const onPause = () => {
      // Don't restart after the clip has finished
      if (el.ended) return;
      if (document.visibilityState === 'visible') tryPlay();
    };

    document.addEventListener('visibilitychange', onVisibility);
    el.addEventListener('pause', onPause);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      el.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={`home-hero__video ${className}`.trim()}
      src={heroVideoSrc}
      autoPlay
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      tabIndex={-1}
      aria-hidden="true"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
