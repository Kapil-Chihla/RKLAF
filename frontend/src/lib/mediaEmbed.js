/**
 * Build an embeddable iframe src (or null) from YouTube / Vimeo / Spotify / Drive / SoundCloud.
 * Direct media files return null — callers should use <audio> / <video> instead.
 * OneDrive / SharePoint share pages are not embeddable reliably — see isCloudSharePageUrl.
 */

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function youtubeId(u) {
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  if (host === 'youtu.be') {
    return u.pathname.slice(1).split('/')[0] || null;
  }
  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com' ||
    host === 'youtube-nocookie.com'
  ) {
    return (
      u.searchParams.get('v') ||
      u.pathname.match(/\/(?:embed|shorts|live|v|watch)\/([^/?]+)/)?.[1] ||
      null
    );
  }
  return null;
}

function spotifyEmbedPath(u) {
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  if (host !== 'open.spotify.com' && host !== 'spotify.com' && host !== 'play.spotify.com') {
    return null;
  }
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts[0]?.startsWith('intl-')) parts.shift();
  let type = parts[0];
  let id = parts[1];
  if (type === 'embed' && parts.length >= 3) {
    type = parts[1];
    id = parts[2];
  }
  if (id && ['episode', 'show', 'track', 'playlist', 'album'].includes(type)) {
    return `${type}/${id}`;
  }
  return null;
}

function driveFileId(u) {
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  if (host !== 'drive.google.com' && host !== 'docs.google.com') return null;
  return u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || u.searchParams.get('id') || null;
}

/** Viewer/share pages that cannot be used as <video src> or a reliable iframe. */
export function isCloudSharePageUrl(url) {
  const host = hostname(url);
  if (!host) return false;
  return (
    host === 'onedrive.live.com' ||
    host === '1drv.ms' ||
    host.endsWith('.sharepoint.com') ||
    host === 'sharepoint.com' ||
    host === 'my.microsoftpersonalcontent.com'
  );
}

export function mediaEmbedUrl(url, { autoplay = false } = {}) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const ap = autoplay ? '1' : '0';
    const host = hostname(url);

    const yt = youtubeId(u);
    if (yt) return `https://www.youtube.com/embed/${yt}?autoplay=${ap}&rel=0`;

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}?autoplay=${ap}` : null;
    }

    const spotify = spotifyEmbedPath(u);
    if (spotify) {
      return `https://open.spotify.com/embed/${spotify}?utm_source=generator&theme=0`;
    }

    const driveId = driveFileId(u);
    if (driveId) return `https://drive.google.com/file/d/${driveId}/preview`;

    if (host === 'soundcloud.com' || host === 'on.soundcloud.com') {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23854f0b&auto_play=${autoplay ? 'true' : 'false'}&hide_related=true&show_comments=false&visual=true`;
    }

    // OneDrive “Embed” URLs only — share/viewer pages still return null
    if (host === 'onedrive.live.com' && (u.pathname === '/embed' || u.searchParams.has('resid'))) {
      if (u.pathname === '/embed' || u.searchParams.get('em')) return url;
      const cid = u.searchParams.get('cid');
      const resid = u.searchParams.get('resid') || u.searchParams.get('id');
      const authkey = u.searchParams.get('authkey');
      if (cid && resid) {
        const q = new URLSearchParams({ cid, resid, em: '2' });
        if (authkey) q.set('authkey', authkey);
        return `https://onedrive.live.com/embed?${q.toString()}`;
      }
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** Dropbox share links → raw file URL the browser can play. */
export function toDirectMediaUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'dropbox.com' || host === 'dl.dropboxusercontent.com') {
      u.searchParams.set('raw', '1');
      u.searchParams.delete('dl');
      return u.toString();
    }
    const path = u.pathname.toLowerCase();
    if (/\.(mp3|m4a|wav|ogg|aac|flac|mp4|webm|mov|m4v)(\?|$)/i.test(path)) {
      return url;
    }
  } catch {
    return null;
  }
  return null;
}

/** True when URL looks like a direct audio/video file (not a platform page). */
export function isDirectMediaUrl(url) {
  return Boolean(toDirectMediaUrl(url));
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

export function isHttpUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Label for external open CTA when in-page play is impossible. */
export function cloudShareLabel(url) {
  const host = hostname(url);
  if (host.includes('onedrive') || host === '1drv.ms' || host.includes('sharepoint')) {
    return 'OneDrive';
  }
  return 'external link';
}
