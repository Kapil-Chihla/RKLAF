export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/rklegalaidfoundation', icon: 'instagram' },
  { name: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
  { name: 'YouTube', href: 'https://www.youtube.com/@radheykrishnalegalaid', icon: 'youtube' },
  { name: 'Spotify', href: 'https://open.spotify.com/user/31weviexrzxc6u4wzye6k6h55jwy?si=803a04082325439a', icon: 'spotify' },
];

/** Organization WhatsApp (India +91) — used site-wide */
const WHATSAPP_PREFILL =
  'Hello, I am contacting Radhey Krishna Legal Aid Foundation from your website.';
export const WHATSAPP_URL = `https://wa.me/917043031263?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
export const WHATSAPP_DISPLAY = '+91 70430 31263';

/** About page section anchors (footer quick links) */
export const aboutSectionLinks = [
  { label: 'Our Mandate & Vision', path: '/about#mandate' },
  { label: 'Our Heritage', path: '/about#heritage' },
  { label: 'Our Team', path: '/about#team' },
];

/** Full RKLAF site map — used in header & footer */
export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  {
    label: 'Our Work',
    path: '/our-work/programs',
    children: [
      { label: 'Programs & Initiatives', path: '/our-work/programs' },
      { label: 'Our Impact', path: '/our-work/impact' },
      { label: 'Annual Reports', path: '/our-work/annual-reports' },
      { label: 'Policy Reports', path: '/our-work/policy-reports' },
    ],
  },
  { label: 'Know Your Rights', path: '/know-your-rights' },
  { label: 'Blogs & Research', path: '/blogs' },
  { label: 'Contact Us', path: '/contact' },
];

export const footerColumns = [
  {
    title: 'About Us',
    links: aboutSectionLinks,
  },
  {
    title: 'Our Work',
    links: navItems.find((n) => n.label === 'Our Work').children,
  },
  {
    title: 'Know Your Rights',
    links: [
      { label: 'Your Rights', path: '/know-your-rights' },
      { label: 'Intake Procedure', path: '/know-your-rights#intake' },
      { label: 'Noted Judgments', path: '/know-your-rights#noted-judgments' },
    ],
  },
];
