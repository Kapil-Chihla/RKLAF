import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
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

const galleryItems = [
  'Legal Camp',
  'RTI Drive',
  'Student Audit',
  'Community Clinic',
  'Tihar Support',
  'Policy Session',
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

const rightsCards = [
  'Bail and fair trial safeguards',
  'Rights of undertrial prisoners',
  'Child safety and POCSO compliance',
  'Disability reservation and equal opportunity',
  'RTI filing and public accountability',
  'How to approach legal aid'
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

export function AboutPage() {
  return (
    <PageShell
      title="About RKLAF"
      subtitle="Our mandate is to democratize access to justice."
    >
      <div className="editorial-page">
        <HeroStatement eyebrow="Our Mandate & Vision" title="The law should be a shield, not an insurmountable barrier.">
          <p>
            Navigating the legal system should not be a privilege reserved for the few. At the
            Radhey Krishna Legal Aid Foundation, we are a dedicated coalition of legal professionals
            and advocates committed to protecting constitutional rights regardless of background or
            financial standing.
          </p>
          <p>
            Our ethos is captured in a promise to the communities we serve: <strong>With You. For You. Nyaya Tak.</strong>
          </p>
        </HeroStatement>
        <PromiseGrid />
        <section className="content-hero-panel">
          <p className="eyebrow">Our Heritage</p>
          <h2>RKLAF is a living tribute to family, empathy, and doing what is right.</h2>
          <div className="content-hero-panel__text">
            <p>
              The Foundation was established as a registered Charitable Trust on November 25, 2016,
              to honor the memory and life&apos;s work of Late Sh. R.S. Garg (Advocate) and his wife,
              Late Smt. Krishna Garg.
            </p>
            <p>
              Sh. R.S. Garg began his career as a respected Judicial Officer in Haryana before
              transitioning into one of Delhi&apos;s leading legal practitioners at the District and High
              Courts. His true legacy was boundless compassion: countless hours of pro-bono legal
              aid for the poor, the needy, and the disabled.
            </p>
            <p>
              Today, under the leadership of Adv. Ajay Garg, RKLAF carries that legacy forward as a
              permanent public resource for accessible, fearless advocacy.
            </p>
          </div>
        </section>
        <section className="story-band">
          <div>
            <p className="eyebrow">Strategic Advocacy</p>
            <h2>On-ground impact with courtroom depth.</h2>
          </div>
          <div className="story-list">
            <p><strong>Protecting civil liberties:</strong> pro-bono defense for undertrials at Delhi Central Jail, Tihar.</p>
            <p><strong>Enforcing accountability:</strong> RTI filings and advocacy for child-safety compliance.</p>
            <p><strong>Advancing disability rights:</strong> litigation for reservations and equal opportunity in public employment.</p>
          </div>
        </section>
        <section className="content-hero-panel">
          <p className="eyebrow">Our Team</p>
          <h2>A robust pursuit of justice requires a formidable network.</h2>
          <div className="content-hero-panel__text">
            <p>
              RKLAF&apos;s impact is amplified by an active alliance of leading legal minds alongside
              dedicated law students and community advocates. Whether someone is seeking seasoned
              legal intervention or looking to contribute expertise to a critical cause, RKLAF is a
              platform for justice.
            </p>
            <p><strong>Stand with us. Let us pursue justice, together.</strong></p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export function HeritagePage() {
  return (
    <PageShell
      title="Our Heritage"
      subtitle="A living tribute to family, empathy, and doing what is right."
    >
      <div className="editorial-page two-column-story">
        <HeroStatement eyebrow="Established November 25, 2016" title="Carrying forward a legacy of fearless advocacy.">
          <p>
            RKLAF was established as a registered Charitable Trust to honor Late Sh. R.S. Garg
            (Advocate) and Late Smt. Krishna Garg. Sh. R.S. Garg began as a respected Judicial
            Officer in Haryana before becoming one of Delhi&apos;s leading legal practitioners at the
            District and High Courts.
          </p>
          <p>
            His true legacy was compassion: countless hours of pro-bono legal aid for the poor, the
            needy, and the disabled, always supported by Smt. Krishna Garg.
          </p>
        </HeroStatement>
        <aside className="heritage-card">
          <span>Today</span>
          <h3>Led by Adv. Ajay Garg</h3>
          <p>
            RKLAF carries that spirit forward, ensuring accessible and fearless advocacy remains a
            permanent public resource.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}

export function TeamPage() {
  return (
    <PageShell
      title="Our Team"
      subtitle="A network of leading legal minds, students, and community advocates."
    >
      <div className="editorial-page">
        <HeroStatement eyebrow="Network of Excellence" title="Justice needs a formidable alliance.">
          <p>
            RKLAF&apos;s impact is amplified by leading legal minds, dedicated law students, and community
            advocates. Team photos and detailed profiles can be added here as soon as they are ready.
          </p>
        </HeroStatement>
        <div className="team-grid">
          {['Leadership', 'Advocates', 'Law Students', 'Community Volunteers'].map((role) => (
            <article className="team-card" key={role}>
              <div className="team-card__avatar">{role.charAt(0)}</div>
              <h3>{role}</h3>
              <p>Profile photos, roles, and short biographies can be published from the admin panel later.</p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
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

      <section id="gallery" className="page-subsection">
        <h2 className="page-subsection__title">Our Camps & Gallery</h2>
        <p className="page-subsection__lead">
          Photos from legal camps, RTI drives, student audits, community clinics, and outreach events.
        </p>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <figure className="gallery-tile" key={item}>
              <div>{item.charAt(0)}</div>
              <figcaption>{item}</figcaption>
            </figure>
          ))}
        </div>
      </section>
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

export function KnowYourRightsPage() {
  return (
    <PageShell
      title="Know Your Rights"
      subtitle="Practical legal literacy, intake guidance, and important case law — all in one place."
    >
      <section className="page-subsection">
        <h2 className="page-subsection__title">Your Legal Rights</h2>
        <p className="page-subsection__lead">
          Plain-language resources for people navigating courts, institutions, and public systems.
        </p>
        <div className="rights-grid">
          {rightsCards.map((right) => (
            <article className="rights-card" key={right}>
              <h3>{right}</h3>
              <p>Plain-language resources, FAQs, multilingual notes, and downloadable explainers can be added here.</p>
            </article>
          ))}
        </div>
      </section>

      <section id="intake" className="page-subsection">
        <h2 className="page-subsection__title">Intake Procedure</h2>
        <p className="page-subsection__lead">
          How RKLAF evaluates requests and routes matters to the right support.
        </p>
        <div className="process-steps">
          {['Reach out', 'Initial screening', 'Document review', 'Legal strategy', 'Representation or referral'].map((step, index) => (
            <article className="process-step" key={step}>
              <span>{index + 1}</span>
              <h3>{step}</h3>
              <p>Our team gathers essential facts, assesses urgency, and identifies the most effective legal pathway.</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/contact" className="btn btn-primary">Request legal support</Link>
        </p>
      </section>

      <section id="noted-judgments" className="page-subsection">
        <h2 className="page-subsection__title">Noted Judgments</h2>
        <p className="page-subsection__lead">
          Important case law and legal developments relevant to public-interest advocacy.
        </p>
        <p className="placeholder-text">
          Judgment notes, legal summaries, and downloadable case briefs can be published here.
        </p>
      </section>
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
