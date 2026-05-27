const { latLngToMapPercent } = require('../utils/geo');

const seeds = [
  {
    name: 'Delhi, India',
    country: 'India',
    region: 'South Asia',
    workType: 'Undertrial Support',
    lat: 28.6139,
    lng: 77.209,
    summary: 'Pro-bono defense and regular visitation at Delhi Central Jail (Tihar).',
    workItems: [
      { title: 'Tihar Jail Undertrial Support', url: '/our-work/programs' },
      { title: 'Community Mobile Clinics', url: '/our-work/programs' },
    ],
    overviewUrl: '/our-work/impact',
  },
  {
    name: 'Uttar Pradesh, India',
    country: 'India',
    region: 'South Asia',
    workType: 'Criminal Defense',
    lat: 26.8467,
    lng: 80.9462,
    summary: 'Trial-court representation and wrongful detention relief across UP.',
    workItems: [{ title: 'Wrongful Detention Case Work', url: '/our-work/impact' }],
    overviewUrl: '/our-work/impact',
  },
  {
    name: 'Mumbai, India',
    country: 'India',
    region: 'South Asia',
    workType: 'Legal Literacy',
    lat: 19.076,
    lng: 72.8777,
    summary: 'Rights awareness drives and community legal outreach.',
    workItems: [{ title: 'Community Rights Drive', url: '/our-work/programs#gallery' }],
    overviewUrl: '/our-work/programs',
  },
  {
    name: 'Mulanje, Malawi',
    country: 'Malawi',
    region: 'Africa',
    workType: 'International Collaboration',
    lat: -15.9345,
    lng: 35.6645,
    summary: 'Project Mpaka Nyaya — legal infrastructure and capacity-building.',
    workItems: [{ title: 'Project Mpaka Nyaya', url: '/our-work/programs' }],
    overviewUrl: '/our-work/programs',
  },
  {
    name: 'Pan-India',
    country: 'India',
    region: 'South Asia',
    workType: 'RTI & Social Audits',
    lat: 22.9734,
    lng: 78.6569,
    summary: 'Nationwide RTI drives and child-safety compliance audits with 80+ law students.',
    workItems: [{ title: 'National RTI & Audit Drives', url: '/our-work/impact' }],
    overviewUrl: '/our-work/impact',
  },
];

module.exports = seeds.map((item, i) => {
  const { mapX, mapY } = latLngToMapPercent(item.lat, item.lng);
  return {
    id: `map-${i + 1}`,
    ...item,
    mapX,
    mapY,
    active: true,
    createdAt: new Date().toISOString(),
  };
});
