import { useEffect, useRef, useState } from 'react';
/* H.264 — Safari will not muted-autoplay the HEVC/QuickTime source (IMG_9334.mp4) */
import heroVideoSrc from '../../assets/IMG_9334.h264.mp4';

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
 * Hero media — muted autoplay once. No loop, no controls.
 * Chrome: filtered <video> + multiply wrapper.
 * Safari: same H.264 file, filter-only path (no multiply).
 */
export default function HeroVideo({ className = '' }) {
  const ref = useRef(null);
  const [safari] = useState(() => isSafariLike());

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    el.controls = false;
    el.removeAttribute('controls');
    el.disablePictureInPicture = true;
    if ('disableRemotePlayback' in el) el.disableRemotePlayback = true;
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute('muted', '');
    el.playsInline = true;
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      if (el.ended) return;
      el.controls = false;
      el.removeAttribute('controls');
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
    el.addEventListener('playing', () => {
      el.controls = false;
      el.removeAttribute('controls');
    });

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
        controls={false}
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        tabIndex={-1}
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
      />
      <span className="home-hero__media-shield" aria-hidden="true" />
    </div>
  );
}
