import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import CampsGallerySection from '../components/camps/CampsGallerySection';
import './RklafPages.css';

const promise = [
  {
    title: 'With You',
    label: 'Partnership',
    body: 'We stand alongside marginalized communities through every step of the legal process, from the first consultation to courtroom strategy.'
  },
  {
    title: 'For You',
    label: 'Dedication',
    body: 'Our legal expertise, institutional resources, and advocacy networks are deployed entirely in the public interest.'
  },
  {
    title: 'Nyaya Tak',
    label: 'Relentless pursuit',
    body: 'The legal process can be arduous. Our commitment is to pursue rights with resilience until justice is secured.'
  }
];

const programs = [
  {
    number: '01',
    title: 'Direct Access to Justice',
    kicker: 'Immediate pro-bono relief',
    items: [
      'Tihar Jail undertrial support with regular prison visits and dedicated representation.',
      'Community mobile clinics in underserved areas for legal awareness and on-the-spot counseling.'
    ]
  },
  {
    number: '02',
    title: 'Systemic Accountability & Advocacy',
    kicker: 'Law as a tool for transparency',
    items: [
      'Public Interest Litigation for disability rights, employment inclusion, and systemic negligence.',
      'National RTI and social audit drives mobilizing 80+ law students across India.'
    ]
  },
  {
    number: '03',
    title: 'Global Impact & Collaborations',
    kicker: 'Justice frameworks across borders',
    items: [
      'Project Mpaka Nyaya in Mulanje, Malawi, launching with remote legal infrastructure and capacity-building.',
      'National and international collaborations with NGOs, legal clinics, and civic bodies.'
    ]
  },
  {
    number: '04',
    title: 'Knowledge & Leadership',
    kicker: 'Training the next generation',
    items: [
      'Research, publications, policy recommendations, and case-law analysis.',
      'Internships, campus ambassador chapters, and volunteer deployments for socially responsible legal minds.'
    ]
  }
];

const impactStories = [
  {
    title: 'Overcoming Wrongful Detention',
    challenge: 'A marginalized individual from Uttar Pradesh spent more than two years in custody under severe NDPS Act charges without the means to mount an adequate defense.',
    action: 'RKLAF stepped in with rigorous trial-court representation, examining the case record and dismantling the prosecution narrative over months of hearings.',
    impact: 'Full acquittal, release from detention, and safe reunion with family in Uttar Pradesh.'
  },
  {
    title: 'Defending the Forgotten in Tihar Jail',
    challenge: 'Undertrials often remain in jail because they lack legal literacy, resources, or procedural support to pursue bail.',
    action: 'Through continuous jail visitation, RKLAF identifies eligible inmates, drafts bail applications, and represents them in court.',
    impact: 'Restored liberty for individuals who were needlessly detained and relief for families who depend on them.'
  },
  {
    title: 'Enforcing Child Safety Nationwide',
    challenge: 'Despite Supreme Court mandates and POCSO guidelines, many institutions fail to implement mandatory child-safety protocols.',
    action: 'RKLAF mobilized 80+ law students to file strategic RTIs and conduct socio-legal audits across India.',
    impact: 'Administrative transparency, compliance pressure, and safer educational spaces for thousands of children.'
  }
];

const practiceAreas = [
  'Civil Liberties',
  'Criminal Defense',
  'Undertrial Support',
  'Child Safety',
  'Disability Rights',
  'RTI',
  'Legal Literacy',
  'Public Interest Litigation',
  'Policy Reform',
];

const achievementStats = [
  { value: '80+', label: 'Law students mobilized for national RTI & social audits' },
  { value: '100%', label: 'Commitment to pro-bono representation for the underserved' },
  { value: '2016', label: 'Registered as a Charitable Trust honoring R.S. & Krishna Garg' },
  { value: 'Tihar', label: 'Ongoing undertrial support at Delhi Central Jail' },
];

const joinPaths = [
  {
    title: 'Pro-Bono Legal Network',
    audience: 'Lawyers & advocates',
    body: 'Partner with RKLAF to represent marginalized individuals, draft PILs, and mentor emerging public-interest lawyers.'
  },
  {
    title: 'Youth Leadership & Campus Ambassadors',
    audience: 'Law students',
    body: 'Lead student chapters, run legal awareness clinics, contribute to RTI drives, and gain research, drafting, and audit experience.'
  },
  {
    title: 'Grassroots Volunteers',
    audience: 'Social workers & citizens',
    body: 'Support mobile clinics, translation, community organizing, and legal literacy programs on the ground.'
  },
  {
    title: 'Support Our Mission',
    audience: 'Donors & partners',
    body: 'Fund PILs, legal defense, mobile clinics, research, and infrastructure for communities that cannot afford representation.'
  }
];

function HeroStatement({ eyebrow, title, children, actions }) {
  return (
    <section className="content-hero-panel">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="content-hero-panel__text">{children}</div>
      {actions && <div className="content-actions">{actions}</div>}
    </section>
  );
}

function PromiseGrid() {
  return (
    <div className="promise-grid">
      {promise.map((item) => (
        <article className="promise-card" key={item.title}>
          <span>{item.label}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function ProgramsPage() {
  return (
    <PageShell
      title="Programs & Initiatives"
      subtitle="Our camps, clinics, PILs, audits, research, and on-the-ground legal aid — with photos from the field."
    >
      <div className="program-grid">
        {programs.map((program) => (
          <article className="program-card" key={program.title}>
            <span className="program-card__number">{program.number}</span>
            <p className="eyebrow">{program.kicker}</p>
            <h3>{program.title}</h3>
            <ul>
              {program.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <CampsGallerySection />
    </PageShell>
  );
}

export function ImpactPage() {
  return (
    <PageShell
      title="Our Impact"
      subtitle="Areas we serve, milestones achieved, and lives changed through legal advocacy."
    >
      <section className="page-subsection">
        <h2 className="page-subsection__title">Areas We Cover</h2>
        <p className="page-subsection__lead">
          Civil liberties, undertrial defense, child safety, disability rights, RTI, and public accountability.
        </p>
        <ul className="tag-list tag-list--large">
          {practiceAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </section>

      <section className="page-subsection">
        <h2 className="page-subsection__title">Achievements & Milestones</h2>
        <div className="impact-dashboard">
          {achievementStats.map((item) => (
            <article className="impact-mini-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
        <div className="content-hero-panel" style={{ marginTop: '2rem' }}>
          <p className="eyebrow">Highlights</p>
          <h3>Justice secured through persistence</h3>
          <div className="content-hero-panel__text">
            <p>
              Full acquittals after wrongful detention. Bail for undertrials. Nationwide child-safety
              compliance driven by student-led audits. Disability-rights litigation. International
              expansion through Project Mpaka Nyaya in Malawi.
            </p>
          </div>
        </div>
      </section>

      <section className="page-subsection">
        <h2 className="page-subsection__title">Impact Stories</h2>
        <div className="impact-dashboard impact-dashboard--compact">
          {['80+ student volunteers mobilized', 'Tihar undertrial support', 'Nationwide child-safety audits', 'PIL and policy advocacy'].map((stat) => (
            <article className="impact-mini-card" key={stat}>
              <strong>{stat.split(' ')[0]}</strong>
              <span>{stat.replace(stat.split(' ')[0], '').trim()}</span>
            </article>
          ))}
        </div>
        <div className="story-cards">
          {impactStories.map((story) => (
            <article className="story-card" key={story.title}>
              <h3>{story.title}</h3>
              <p><strong>Challenge:</strong> {story.challenge}</p>
              <p><strong>Action:</strong> {story.action}</p>
              <p><strong>Impact:</strong> {story.impact}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function JoinPage() {
  return (
    <PageShell
      title="Join the Fight for Justice"
      subtitle="RKLAF is fueled by legal professionals, passionate students, and everyday citizens."
    >
      <div className="join-layout">
        <HeroStatement eyebrow="Be a Part of Our Team" title="There is a place for you on the frontlines.">
          <p>
            The fight for systemic justice cannot be fought alone. Whether you are an advocate, law
            student, social worker, translator, citizen volunteer, donor, or institutional partner,
            your contribution can move a real case, clinic, or reform effort forward.
          </p>
          <div className="content-actions">
            <Link to="/contact" className="btn btn-primary">Contact the team</Link>
            <Link to="/donate" className="btn btn-secondary">Donate to a program</Link>
          </div>
        </HeroStatement>
        <div className="join-grid">
          {joinPaths.map((path) => (
            <article className="join-card" key={path.title}>
              <span>{path.audience}</span>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function NotedJudgmentsPage() {
  return (
    <PageShell
      title="Noted Judgments"
      subtitle="Important case law and legal developments relevant to public-interest advocacy."
    >
      <p className="placeholder-text">
        Judgment notes, legal summaries, and downloadable case briefs can be published here.
      </p>
    </PageShell>
  );
}

export function MediaCoveragePage() {
  return (
    <PageShell
      title="Media Coverage"
      subtitle="Press mentions, public campaigns, interviews, and institutional updates."
    >
      <p className="placeholder-text">Media coverage entries can be added here with publication name, date, summary, and link.</p>
    </PageShell>
  );
}

export function AnnualReportsPage() {
  return (
    <PageShell
      title="Annual Reports"
      subtitle="Transparency documents and yearly summaries of RKLAF&apos;s work."
    >
      <p className="placeholder-text">Annual reports can be uploaded here with PDF download links and year-wise highlights.</p>
    </PageShell>
  );
}

export function PolicyReportsPage() {
  return (
    <PageShell
      title="Policy Reports"
      subtitle="Research, recommendations, audit findings, and legal reform proposals."
    >
      <p className="placeholder-text">Policy reports can be published here with summaries, authors, dates, and downloadable files.</p>
    </PageShell>
  );
}
