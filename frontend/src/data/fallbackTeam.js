import photoAjayStory from '../assets/_unused/father.jpeg';
import photoRuchi from '../assets/imageruchi.jpg';

export { photoRuchi };

/** Fallback when CMS /api/team is empty — keep About + Team page in sync */
export const FALLBACK_TEAM = [
  {
    id: 'ajay-garg',
    name: 'Mr. Ajay Garg, Advocate',
    role: 'Founder',
    subtitle: 'Founder · Supreme Court of India & Delhi High Court',
    bio: "A graduate of the Campus Law Centre, University of Delhi, Mr. Ajay Garg has over three decades of experience as a practising Advocate before the Supreme Court of India and the Delhi High Court. Alongside his professional practice, he has personally undertaken numerous pro bono matters before the Supreme Court and the Delhi High Court, several of which have resulted in reported judgments. As Founder, he continues to guide the Foundation's work and carry forward the legacy upon which RKLAF was founded.",
    image: photoAjayStory,
    photoPos: 'left center',
  },
  {
    id: 'ruchi-garg',
    name: 'Mrs. Ruchi Garg',
    role: 'Trustee',
    subtitle: 'Trustee',
    bio: "Mrs. Ruchi Garg serves as a Trustee of the Foundation and has been an integral part of carrying its work forward. Her involvement reflects the same spirit of partnership that has been part of the Foundation's story from the beginning.",
    image: photoRuchi,
    photoPos: 'center 28%',
  },
];

export function isRuchiMember(m) {
  const id = String(m?.id || '').toLowerCase();
  const name = String(m?.name || '').toLowerCase();
  return id.includes('ruchi') || name.includes('ruchi');
}

/** Prefer CMS image; otherwise local Ruchi portrait for known id / name. */
export function teamMemberImage(m) {
  if (m?.image) return m.image;
  if (isRuchiMember(m)) return photoRuchi;
  return null;
}

/** Team card crop — fill frame (cover); Ruchi gets a slightly higher face position. */
export function teamPhotoCrop(m) {
  if (isRuchiMember(m)) {
    return { photoPos: m?.photoPos || 'center 28%' };
  }
  return { photoPos: m?.photoPos || 'center center' };
}
