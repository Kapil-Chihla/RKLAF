export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const UPLOADS_BASE = API_BASE.replace(/\/api\/?$/, '');

export function assetUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${UPLOADS_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
