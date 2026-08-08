import Reveal from '../components/motion/Reveal';
import WorkBrowse from '../components/our-work/WorkBrowse';
import { ProgrammeBlock, WorkPageBanner } from '../components/our-work/WorkParts';
import './OurWork.css';

const areas = [
  {
    num: '01',
    stripe: 'brown',
    meta: 'Flagship · Since 2018',
    title: 'Senior Citizens Protection Desk',
    desc: 'Maintenance petitions, Section 23 cancellations of coerced property transfers, and tribunal representation with a volunteer at every hearing.',
    stats: [
      { value: '400+', label: 'elders protected' },
      { value: '47', label: 'days to first order' },
      { value: '94%', label: 'orders complied with' },
    ],
    href: '/our-work/programmes',
    flip: false,
  },
  {
    num: '02',
    stripe: 'brown',
    meta: 'Outreach · Weekends',
    title: 'Mobile Legal Aid Camps',
    desc: 'Camps in villages and urban settlements: on-the-spot advice, same-day drafting and case registration, routed by helpline demand.',
    stats: [
      { value: '40+', label: 'camps held' },
      { value: '3,100+', label: 'people engaged' },
      { value: '9', label: 'districts this year' },
    ],
    href: '/our-work/programmes#camps',
    flip: true,
  },
  {
    num: '03',
    stripe: 'brown',
    meta: 'Education · Ongoing',
    title: 'Digital Legal Literacy Hub',
    desc: 'Plain-language rights modules, infographics and short videos in Hindi and English, with large print and audio versions for senior citizens.',
    stats: [
      { value: '24', label: 'modules' },
      { value: '12', label: 'partner law schools' },
      { value: '2', label: 'languages' },
    ],
    href: '/know-your-rights',
    flip: false,
  },
  {
    num: '04',
    stripe: 'olive',
    meta: 'National · Student-led',
    title: 'RTI & NRI Guidance Drives',
    desc: 'Student-led RTI drives that unlock pensions and entitlements, plus a remote desk guiding overseas Indians through matters back home.',
    stats: [
      { value: '80+', label: 'students' },
      { value: '300+', label: 'RTIs filed' },
      { value: '11', label: 'countries served' },
    ],
    href: '/our-work/reports',
    flip: true,
  },
];

export default function OurWork() {
  return (
    <div className="work work--v2">
      <WorkPageBanner title="Our Work" />
      <WorkBrowse activeId="areas" />

      <section id="programmes" className="work-programmes">
        <div className="container">
          <Reveal as="p" className="work-section-label" variant="up">
            <span className="work-section-label__rule" aria-hidden="true" />
            Areas of Work
          </Reveal>

          <div className="work-programmes__list">
            {areas.map((item, i) => (
              <Reveal key={item.num} as="div" variant="up" delay={i * 40}>
                <ProgrammeBlock item={item} />
                {i < areas.length - 1 ? <hr className="work-divider" /> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
