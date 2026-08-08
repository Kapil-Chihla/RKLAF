/**
 * Build an embeddable iframe src (or null) from YouTube / Vimeo / Spotify URLs.
 * Direct media files return null — callers should use <audio> / <video> instead.
 */
export function mediaEmbedUrl(url, { autoplay = false } = {}) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const ap = autoplay ? '1' : '0';

    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=${ap}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const id =
        u.searchParams.get('v') ||
        u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
        u.pathname.match(/\/live\/([^/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=${ap}` : null;
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=${ap}` : null;
    }
    if (host === 'open.spotify.com' || host === 'spotify.com') {
      // /embed/episode/x or /episode/x → embed
      const parts = u.pathname.split('/').filter(Boolean);
      let type = parts[0];
      let id = parts[1];
      if (type === 'embed' && parts.length >= 3) {
        type = parts[1];
        id = parts[2];
      }
      if (id && ['episode', 'show', 'track', 'playlist', 'album'].includes(type)) {
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** True when URL looks like a direct audio/video file (not a platform page). */
export function isDirectMediaUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return /\.(mp3|m4a|wav|ogg|aac|flac|mp4|webm|mov|m4v)(\?|$)/i.test(path);
  } catch {
    return false;
  }
}

export function isAudioMediaUrl(url) {
  if (!url) return false;
  try {
    const path = new URL(url).pathname.toLowerCase();
    return /\.(mp3|m4a|wav|ogg|aac|flac)(\?|$)/i.test(path);
  } catch {
    return false;
  }
}
