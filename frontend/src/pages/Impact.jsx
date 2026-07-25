import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import './Impact.css';

const regions = [
  { name: 'Braj Region', sub: 'Mathura · Vrindavan', pill: '612 cases · 22 camps' },
  { name: 'NCR Cluster', sub: 'Gurgaon · Faridabad · Delhi', pill: '438 cases filed' },
  { name: 'Awadh Belt', sub: 'Camps & desks', pill: '300+ RTIs unlocked' },
  { name: 'Beyond · NRI', sub: 'Remote desk', pill: '11 countries · NRI desk' },
];

const stats = [
  {
    label: 'Since 2016',
    value: '1,390+',
    desc: 'cases won or settled, each traceable to a named file',
  },
  {
    label: 'Elders',
    value: '400+',
    desc: 'protected through the Senior Citizens Protection Desk',
  },
  {
    label: 'Families',
    value: '3,100+',
    desc: 'reached through camps, helpline, and clinic desks',
  },
  {
    label: 'Verified',
    value: '94%',
    desc: 'orders complied with after tribunal or settlement',
  },
];

const stories = [
  {
    tag: 'Senior Citizens',
    title: 'Kamla Devi, 74, gets her home back',
    photo: 'Portrait',
    caption: 'Kamla Devi on her verandah, order copy in hand',
    problem: 'Moved into a storeroom of the house she built; gift deed signed under pressure.',
    action: 'Section 23 petition with a volunteer at every hearing.',
    result: 'Order restored possession in 63 days; deed cancelled.',
  },
  {
    tag: 'Labour Rights',
    title: 'Six months of wages, recovered in three steps',
    photo: 'Photo',
    caption: 'Worker with wage slip at the commissioner desk',
    problem: 'Unpaid wages after a construction site shut without notice.',
    action: 'Labour commissioner route with timelines documented at camp.',
    result: 'Settlement paid; case closed without a full trial.',
  },
  {
    tag: 'Family Law',
    title: 'A maintenance order that finally stuck',
    photo: 'Portrait',
    caption: 'Mother and child outside the family court',
    problem: 'Prior petitions stalled; no compliance for over a year.',
    action: 'Fresh filing with enforcement follow-up and helpline check-ins.',
    result: 'Monthly support resumed; arrears schedule fixed.',
  },
];

export default function Impact() {
  return (
    <div className="impact">
      {/* Hero */}
      <header className="impact-hero">
        <div className="impact-hero__photo" aria-hidden="true">
          <span>
            Full-bleed photo placeholder · Drone shot of a village legal camp at golden hour
          </span>
        </div>
        <div className="container impact-hero__inner">
          <Reveal as="div" className="impact-hero__copy" variant="up">
            <span className="impact-rule impact-rule--light" aria-hidden="true" />
            <h1>The Impact</h1>
            <p>
              Twelve years, thirty-eight districts, one promise kept: nobody loses a case because they
              could not afford to fight it. This is what that looks like on the ground.
            </p>
            <a href="#stories" className="impact-play">
              <span aria-hidden="true">▶</span>
              Watch our story
            </a>
          </Reveal>
        </div>
        <div className="impact-hero__wave" aria-hidden="true" />
      </header>

      {/* Footprint */}
      <section id="footprint" className="impact-foot">
        <div className="container impact-foot__grid">
          <Reveal as="div" className="impact-foot__copy" variant="up">
            <span className="impact-rule" aria-hidden="true" />
            <h2>
              Discover
              <br />
              The Footprint
            </h2>
            <p>
              From one office desk to camps, clinics and an NRI line — the work now spans North India and
              reaches families overseas who still fight matters back home.
            </p>
          </Reveal>

          <Reveal as="div" className="impact-foot__map" variant="scale" delay={60}>
            {regions.map((r, i) => (
              <div key={r.name} className={`impact-node impact-node--${i + 1}`}>
                <div className="impact-node__ring">
                  <strong>{r.name}</strong>
                  <span>{r.sub}</span>
                </div>
                <p className="impact-node__pill">{r.pill}</p>
              </div>
            ))}
            <svg className="impact-foot__lines" viewBox="0 0 400 320" aria-hidden="true">
              <path
                d="M90 70 C140 90, 180 120, 210 150 S280 200, 310 240"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <path
                d="M210 70 C230 110, 250 140, 210 170"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
            </svg>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section id="counted" className="impact-stats">
        <div className="container">
          <Reveal as="header" variant="up">
            <span className="impact-rule impact-rule--gold" aria-hidden="true" />
            <h2>Who we helped, counted honestly</h2>
          </Reveal>
          <div className="impact-stats__grid">
            {stats.map((s, i) => (
              <Reveal key={s.label} as="div" className="impact-stat" variant="up" delay={i * 40}>
                <p className="impact-stat__label">{s.label}</p>
                <p className="impact-stat__value">{s.value}</p>
                <p className="impact-stat__desc">{s.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="impact-stats__scales" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M60 18v70M40 28h40" />
              <path d="M28 28l-12 36h24L28 28zM92 28l-12 36h24L92 28z" />
              <circle cx="60" cy="96" r="8" />
            </svg>
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section id="stories" className="impact-stories">
        <div className="container">
          <Reveal as="header" variant="up">
            <span className="impact-rule" aria-hidden="true" />
            <h2>Success stories</h2>
          </Reveal>

          <div className="impact-stories__grid">
            {stories.map((story, i) => (
              <Reveal key={story.title} as="article" className="impact-story" variant="up" delay={i * 50}>
                <div className="impact-story__photo" aria-hidden="true">
                  <span className="impact-story__ph-label">{story.photo}</span>
                  <p className="impact-story__caption">{story.caption}</p>
                </div>
                <div className="impact-story__body">
                  <p className="impact-story__tag">{story.tag}</p>
                  <h3>{story.title}</h3>
                  <dl>
                    <div>
                      <dt>Problem</dt>
                      <dd>{story.problem}</dd>
                    </div>
                    <div>
                      <dt>Action</dt>
                      <dd>{story.action}</dd>
                    </div>
                    <div>
                      <dt>Result</dt>
                      <dd>{story.result}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hands */}
      <section id="hands" className="impact-hands">
        <div className="container">
          <Reveal as="header" className="impact-hands__head" variant="up">
            <span className="impact-rule" aria-hidden="true" />
            <h2>The hands behind the numbers</h2>
            <p>
              240 volunteer advocates, 80+ law students and hundreds of community workers. Every order copy
              in the photos above was carried by one of these hands.
            </p>
          </Reveal>

          <div className="impact-hands__grid">
            <Reveal as="div" className="impact-hand impact-hand--tall" variant="up" aria-hidden="true">
              <span>Volunteer portrait</span>
              <small>Advocate at camp desk</small>
            </Reveal>
            <Reveal as="div" className="impact-hand" variant="up" delay={40} aria-hidden="true">
              <span>Oath day group</span>
            </Reveal>
            <Reveal as="div" className="impact-hand" variant="up" delay={60} aria-hidden="true">
              <span>Helpline shift</span>
            </Reveal>
            <Reveal as="blockquote" className="impact-hand-quote" variant="up" delay={80}>
              <p>
                “I joined for court experience. I stayed because Kamla Devi hugged me on order day.”
              </p>
              <footer>— Second-year law student, campus clinic</footer>
            </Reveal>
            <Reveal as="div" className="impact-hand impact-hand--sm" variant="up" delay={50} aria-hidden="true">
              <span>Student interns</span>
            </Reveal>
            <Reveal as="div" className="impact-hand impact-hand--wide" variant="up" delay={70} aria-hidden="true">
              <span>Camp crowd, wide shot</span>
              <small>Weekend legal aid camp</small>
            </Reveal>
          </div>

          <p className="impact-hands__cta">
            <Link to="/our-work">See the programmes behind these numbers →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
