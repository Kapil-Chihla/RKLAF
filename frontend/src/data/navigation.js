export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/rklegalaidfoundation', icon: 'instagram' },
  { name: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
  { name: 'YouTube', href: 'https://www.youtube.com/@radheykrishnalegalaid', icon: 'youtube' },
  { name: 'Spotify', href: 'https://open.spotify.com/user/31weviexrzxc6u4wzye6k6h55jwy?si=803a04082325439a', icon: 'spotify' },
];

export const WHATSAPP_URL = 'https://wa.me/919999999999';

/** Full RKLAF site map — used in header & footer */
export const navItems = [
  { label: 'Home', path: '/' },
  {
    label: 'About Us',
    path: '/about',
    children: [
      { label: 'Our Mandate & Vision', path: '/about' },
      { label: 'Our Heritage', path: '/about/heritage' },
      { label: 'Our Team', path: '/about/team' },
    ],
  },
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
    links: navItems.find((n) => n.label === 'About Us').children,
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
