export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/rklegalaidfoundation', icon: 'instagram' },
  { name: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
  { name: 'YouTube', href: 'https://www.youtube.com/@radheykrishnalegalaid', icon: 'youtube' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { name: 'Spotify', href: 'https://open.spotify.com/', icon: 'spotify' },
];

const WHATSAPP_PREFILL =
  'Hello, I am contacting Radhey Krishna Legal Aid Foundation from your website.';
export const WHATSAPP_URL = `https://wa.me/917043031263?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
export const WHATSAPP_DISPLAY = '+91 70430 31263';

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
  { label: 'Our Mandate', path: '/about#mandate' },
  { label: 'Our Heritage', path: '/about#heritage' },
  { label: 'Our Team', path: '/about#team' },
  { label: 'The Journey', path: '/about#journey' },
];
