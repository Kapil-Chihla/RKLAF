import { useEffect, useRef, useState } from 'react';
import heroVideoSrc from '../../assets/IMG_9334.mp4';

/** Safari/WebKit mishandles filter + mix-blend-mode on <video>. */
function isSafariLike() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
  const isIOS =
    /iP(hone|od|ad)/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isSafari || isIOS;
}

/**
 * Hero media — autoplays muted once. No loop, no controls.
 * Wrapper keeps Chrome sketch multiply; Safari uses filter-only path.
 */
export default function HeroVideo({ className = '' }) {
  const ref = useRef(null);
  const [safari] = useState(() => isSafariLike());

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const tryPlay = () => {
      if (el.ended) return;
      el.muted = true;
      el.defaultMuted = true;
      el.setAttribute('muted', '');
      el.playsInline = true;
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    tryPlay();
    el.addEventListener('loadeddata', tryPlay);
    el.addEventListener('canplay', tryPlay);
    el.addEventListener('canplaythrough', tryPlay);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    const onPause = () => {
      if (el.ended) return;
      if (document.visibilityState === 'visible') tryPlay();
    };

    document.addEventListener('visibilitychange', onVisibility);
    el.addEventListener('pause', onPause);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('loadeddata', tryPlay);
      el.removeEventListener('canplay', tryPlay);
      el.removeEventListener('canplaythrough', tryPlay);
    };
  }, []);

  const wrapClass = [
    'home-hero__media',
    safari ? 'home-hero__media--safari' : '',
    className.replace(/\bhome-hero__media\b/g, '').trim(),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapClass}>
      <video
        ref={ref}
        className="home-hero__video"
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
    </div>
  );
}
