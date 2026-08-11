import { useEffect, useRef } from 'react';
import heroVideoSrc from '../../assets/herovideo.mp4';

/**
 * Ambient hero media — autoplays muted on a loop.
 * No controls, no pause UI; reads as motion artwork, not a player.
 */
export default function HeroVideo({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const tryPlay = () => {
      el.muted = true;
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    document.addEventListener('visibilitychange', onVisibility);
    const onPause = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
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
      loop
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
