export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/rklegalaidfoundation', icon: 'instagram' },
  { name: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
  { name: 'YouTube', href: 'https://www.youtube.com/@radheykrishnalegalaid', icon: 'youtube' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/radhey-krishna-legal-aid-foundation/', icon: 'linkedin' },
  { name: 'Spotify', href: 'https://open.spotify.com/', icon: 'spotify' },
];

/** Canonical contact — use these everywhere (tel / WhatsApp / mailto). */
export const CONTACT_PHONE_E164 = '919811109663';
export const CONTACT_PHONE_TEL = '+919811109663';
export const CONTACT_PHONE_DISPLAY = '+91 98111 09663';
export const CONTACT_EMAIL = 'radheykrishnalegalaid@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Head office — Delhi (default when a single address is shown) */
export const OFFICE_DELHI = {
  title: 'Head office',
  city: 'Delhi',
  lines: [
    'B-5/152, Basement, Safdarjung Enclave',
    'Near Centre for Sight Hospital',
    'New Delhi-110029',
  ],
  short: 'B-5/152, Basement, Safdarjung Enclave, New Delhi-110029',
  mapsUrl: 'https://www.google.com/maps?q=28.561718,77.191261',
  mapsEmbed: 'https://maps.google.com/maps?q=28.561718,77.191261&z=16&output=embed',
};

/** Branch office — Imphal */
export const OFFICE_IMPHAL = {
  title: 'Branch office',
  city: 'Imphal',
  lines: [
    'Kwakeithel Thiyam Leikai',
    'Near St. Peter’s High School',
    'Imphal West District, Manipur-795001',
  ],
  short: 'Kwakeithel Thiyam Leikai, Near St. Peter’s High School, Imphal West, Manipur-795001',
  phoneTel: '+919101646968',
  phoneDisplay: '+91 9101646968',
};

const WHATSAPP_PREFILL =
  'Hello, I am contacting Radhey Krishna Legal Aid Foundation from your website.';
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_E164}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
export const WHATSAPP_DISPLAY = CONTACT_PHONE_DISPLAY;

/** Header + footer Explore — Contact lives via Get in Touch → /contact */
export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Work', path: '/our-work' },
  { label: 'Know Your Rights', shortLabel: 'Rights', path: '/know-your-rights' },
  { label: 'Impact', path: '/impact' },
  { label: 'Library', path: '/library' },
  { label: 'Academics', path: '/academics' },
  { label: 'Join Us', path: '/join-us' },
];

export const footerColumns = [];
export const aboutSectionLinks = [
  { label: 'About Us', path: '/about#about-hero' },
  { label: 'Our Philosophy', path: '/about#philosophy' },
  { label: 'Our Story', path: '/about#story' },
  { label: 'What We Do', path: '/about#work' },
  { label: 'Where We Work', path: '/about#where' },
];
