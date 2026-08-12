import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import WorkBrowse from '../components/our-work/WorkBrowse';
import { ProgrammeBlock, WorkPageBanner } from '../components/our-work/WorkParts';
import './OurWork.css';

const areas = [
  {
    num: '01',
    stripe: 'brown',
    meta: 'Flagship · Since 2016',
    title: 'Case Representation',
    paragraphs: [
      'Free, pro bono representation across Criminal Law, Service Law, Labour & Employment Law, Consumer Protection, and PILs, Writ Petitions & Civil Liberties Matters, from Delhi’s District Courts to the Delhi High Court and the Supreme Court of India.',
    ],
    highlights: ['500+ cases handled', '100% pro bono, every case', '10+ yrs of continuous work'],
    href: '/impact',
    flip: false,
  },
  {
    num: '02',
    stripe: 'brown',
    meta: 'Flagship · Public Interest · Since 2016',
    title: 'Public Interest & Strategic Litigation',
    paragraphs: [
      'We pursue Public Interest Litigations, Writ Petitions, and Strategic Legal Interventions addressing issues that extend beyond individual cases and affect fundamental rights, civil liberties, vulnerable communities, and the public interest.',
      'Through litigation and related legal interventions, we seek to challenge systemic gaps, strengthen institutional accountability, and advance the effective implementation of law and constitutional rights.',
    ],
    tags: 'PILs & Writ Petitions · Strategic Litigation · Constitutional Rights · Civil Liberties · Institutional Accountability',
    href: '/impact',
    flip: true,
  },
  {
    num: '03',
    stripe: 'brown',
    meta: 'Flagship · Prison Legal Aid · Since 2018',
    title: 'Legal Aid Program — Delhi Prisons',
    paragraphs: [
      'In-jail legal consultations, full case representation, and rights awareness for undertrials and inmates, twice a week, inside the jail.',
    ],
    highlights: [
      '500+ inmates assisted',
      'officially recognized by Delhi Prisons',
      'visits twice a week',
    ],
    href: '/our-work/desk/delhi-prison-programme',
    flip: false,
  },
  {
    num: '04',
    stripe: 'olive',
    meta: 'Community Outreach & Legal Literacy · Ongoing',
    title: 'Legal Awareness & Literacy',
    paragraphs: [
      'Our Ghar Ghar Nyaya i.e. door to door initiative, community literacy sessions, legal aid camps, and our Know Your Rights Campaign, spanning in person outreach, digital content, and practical guides.',
      'From a doorstep conversation to a two-minute explainer, our aim is the same: to help people understand their rights before a legal problem becomes a crisis.',
    ],
    tags: 'Community outreach · Legal aid & mobile camps · Digital legal literacy · Practical legal resources · Know Your Rights · Podcasts',
    flip: true,
  },
  {
    num: '05',
    stripe: 'brown',
    meta: 'Policy · Since 2017',
    title: 'Research & Policy Advocacy',
    paragraphs: [
      'Field-based research, surveys, white papers, and active ongoing research turned into policy recommendations and direct engagement with lawmakers and institutions, including our Checklist to Strengthen Police Investigation, adopted by Delhi Police.',
    ],
    tags: 'Field research · Surveys & consultations · White papers & policy briefs · Legal & policy analysis · Institutional engagement · Evidence-based advocacy · Policy recommendations',
    flip: false,
  },
  {
    num: '06',
    stripe: 'olive',
    meta: 'Capacity Building · Ongoing',
    title: 'Youth Leadership & Volunteer Development',
    paragraphs: [
      'Hands on pro bono experience and structured training for practicing advocates, law students, interns, and volunteers. Through training, mentorship, research, community outreach, and pro bono work, we foster socially responsible legal professionals while engaging volunteers from law, research, communications, technology, social work, and other fields.',
    ],
    tags: 'Training & mentorship · Campus Ambassadors · Legal Internships · Volunteer Engagement · Skill Development · Pro Bono Experience · Multidisciplinary Collaboration',
    flip: true,
  },
  {
    num: '07',
    stripe: 'brown',
    meta: 'Institutional · Ongoing',
    title: 'Partnerships & Institutional Collaboration',
    paragraphs: [
      'Working alongside government bodies, Delhi Prisons, NGOs, CSR programs, organizations, law firms, and colleges, to strengthen and expand our legal aid, awareness, research, and community initiatives.',
      'By bringing together expertise, resources, and networks across sectors, we build partnerships that help take access to justice further and reach those who need it most.',
    ],
    flip: false,
  },
  {
    num: '08',
    stripe: 'olive',
    meta: 'International · Launching Soon',
    title: 'International Program',
    paragraphs: [
      'Extending RKLAF’s legal aid work beyond India, bringing our model of free, pro bono representation and legal awareness to communities abroad.',
    ],
    status: 'Coming soon',
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
              <Reveal key={item.num} as="div" variant="up" delay={Math.min(i * 40, 200)}>
                <ProgrammeBlock item={item} />
                {i < areas.length - 1 ? <hr className="work-divider" /> : null}
              </Reveal>
            ))}
          </div>

          <Reveal as="p" className="work-areas__note" variant="up">
            These areas work together, not in isolation — our Delhi Prisons program, for instance,
            combines case representation with legal awareness and institutional partnership all at once.
            Explore each programme on{' '}
            <Link to="/our-work/programmes">Programmes &amp; Initiatives</Link> for the full picture.
          </Reveal>
        </div>
      </section>
    </div>
  );
}
