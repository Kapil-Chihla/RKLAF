import { assetUrl } from './api';

export function formatCampDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getCampHero(camp) {
  return assetUrl(camp?.heroImage || camp?.coverImage || camp?.images?.[0]?.url || camp?.image);
}

export function getCampCover(camp) {
  return getCampHero(camp);
}

export function campSummary(camp) {
  if (camp.summary?.trim()) return camp.summary.trim();
  if (!camp.description) return '';
  const plain = camp.description.replace(/\s+/g, ' ').trim();
  return plain.length > 140 ? `${plain.slice(0, 137)}…` : plain;
}

export function campPhotoCount(camp) {
  return camp.images?.length || (camp.image ? 1 : 0);
}
