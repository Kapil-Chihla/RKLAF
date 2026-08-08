import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSketch from '../components/home/HeroSketch';
import CountUp from '../components/motion/CountUp';
import Reveal from '../components/motion/Reveal';
import { WHATSAPP_DISPLAY, WHATSAPP_URL, CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_PHONE_TEL, OFFICE_DELHI } from '../data/navigation';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import './Home.css';

const snapModules = import.meta.glob('../assets/{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20}.jpeg', {
  eager: true,
  import: 'default',
});

function snapSrc(n) {
  return snapModules[`../assets/${n}.jpeg`];
}

const SNAP_CAPTIONS = [
  'On the ground',
  'Together at camp',
  'Rights in practice',
  'Community day',
  'Listening first',
  'Relief in hand',
  'At the hearing',
  'Side by side',
  'Village intake',
  'Order in hand',
  'Helpline shift',
  'Tribunal steps',
  'Camp morning',
  'Rights workshop',
  'Family counsel',
  'Volunteer desk',
  'Court corridor',
  'Field visit',
  'Community hall',
  'Case follow-up',
];

/** Prefer faces / subjects for tall phone shots cropped into the square frame. */
const SNAP_FOCUS = {
  1: 'center 28%',
  2: 'center 22%',
  5: 'center 30%',
  6: 'center 28%',
  8: 'center 35%',
  9: 'center 25%',
  11: 'center 28%',
  12: 'center 30%',
  13: 'center 22%',
  14: 'center 24%',
  16: 'center 28%',
  18: 'center 20%',
};

const snapshots = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    src: snapSrc(n),
    label: `Field snapshot ${n}`,
    caption: SNAP_CAPTIONS[i],
    focus: SNAP_FOCUS[n] || 'center center',
  };
});

const snapshotsRow2 = Array.from({ length: 10 }, (_, i) => {
  const n = i + 11;
  return {
    src: snapSrc(n),
    label: `Field snapshot ${n}`,
    caption: SNAP_CAPTIONS[i + 10],
    focus: SNAP_FOCUS[n] || 'center center',
  };
});

const introStats = [
  { end: 2016, suffix: '', label: 'Registered as a Charitable Trust', icon: 'people', duration: 2200 },
  { end: 3100, suffix: '+', label: 'People engaged through camps', icon: 'heart', duration: 2000 },
  { end: 40, suffix: '+', label: 'On-ground legal aid camps', icon: 'scales', duration: 1400 },
  { end: 80, suffix: '+', label: 'Law students in RTI drives', icon: 'gavel', duration: 1600 },
];

const sideNav = [
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'stories', label: 'Impact' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'resources', label: 'Resources' },
  { id: 'join-help', label: 'Join Us & Help' },
  { id: 'contact-home', label: 'Contact' },
];

const FALLBACK_PROGRAMMES = [
  {
    id: 'fb-p1',
    num: '01',
    tag: 'Flagship · Since 2018',
    title: 'Senior Citizens Protection Desk',
    desc: '400+ elders protected through maintenance, property, and abuse cases.',
    visual: 'Elder with advocate',
    caption: 'At the tribunal steps',
    slug: null,
    heroImage: null,
  },
  {
    id: 'fb-p2',
    num: '02',
    tag: 'Camps · Nationwide',
    title: 'Legal Aid Camps',
    desc: '40+ on-ground camps bringing free counsel to villages and city wards.',
    visual: 'Camp intake desk',
    caption: 'Walking in together',
    slug: null,
    heroImage: null,
  },
  {
    id: 'fb-p3',
    num: '03',
    tag: 'Rights · Education',
    title: 'Know Your Rights Drives',
    desc: 'Plain-language guides, workshops, and school clinics on constitutional rights.',
    visual: 'Rights workshop',
    caption: 'Rights class, Faridabad',
    slug: null,
    heroImage: null,
  },
  {
    id: 'fb-p4',
    num: '04',
    tag: 'Accountability · RTI',
    title: 'RTI & Public Interest',
    desc: '80+ law students unlocking pensions, ration, and scheme entitlements.',
    visual: 'RTI filing desk',
    caption: 'Order copy in hand',
    slug: null,
    heroImage: null,
  },
];

function mapHomeProgramme(s, i) {
  const num = String(s.number || i + 1).padStart(2, '0');
  return {
    id: s.id || s.slug || `prog-${i}`,
    num,
    tag: s.kicker || 'Programme',
    title: s.fullHeader || s.title,
    desc: (s.featureBlurb || '').trim() || (s.listingDescription || '').split(/\n+/)[0]?.trim() || '',
    slug: s.slug || null,
    heroImage: s.heroImage ? assetUrl(s.heroImage) : null,
    visual: 'Programme photo',
    caption: s.caption || '',
  };
}

/** Duplicate until the strip is wider than the viewport (avoids empty cream gaps). */
function marqueeSet(items, minCards = 14) {
  const set = [];
  while (set.length < minCards) set.push(...items);
  return set;
}

const FALLBACK_STORIES = [
  {
    id: 'fallback-1',
    tag: 'Senior Citizens',
    title: 'Kamla Devi, 74, gets her home back',
    desc: 'Coerced gift deed cancelled, possession restored, ₹8,000 monthly maintenance in 63 days.',
    visual: 'Portrait',
    caption: 'Kamla Devi at her home',
  },
  {
    id: 'fallback-2',
    tag: 'Labour Rights',
    title: '42 workers recover 6 months of unpaid wages',
    desc: 'Wage claims reconstructed from screenshots and recovered with interest.',
    visual: 'Group photo',
    caption: 'Construction workers at site',
  },
  {
    id: 'fallback-3',
    tag: 'Family Law',
    title: 'Ruksana wins custody and a safe home',
    desc: 'Protection orders secured and full custody granted after a six-month fight.',
    visual: 'Portrait',
    caption: 'Leaving court with relief',
  },
];

function mapHomeStory(s, i) {
  return {
    id: s.id || s.slug || `story-${i}`,
    slug: s.slug || null,
    tag: s.tag || 'Litigation',
    title: s.title,
    desc: (s.result || s.action || s.problem || s.desc || '').trim(),
    visual: s.photo || 'Portrait',
    caption: s.caption || '',
    heroImage: s.heroImage ? assetUrl(s.heroImage) : null,
  };
}

const expertise = [
  { title: 'Senior Citizens', desc: 'Maintenance, property protection and elder abuse under the 2007 Act' },
  { title: 'Family & Women', desc: 'Domestic violence, custody, maintenance and safe separation' },
  { title: 'Labour & Wages', desc: 'Unpaid wages, wrongful termination and injury claims' },
  { title: 'Property & Tenancy', desc: 'Illegal possession, tenancy disputes and title guidance' },
  { title: 'Consumer Rights', desc: 'Defective goods, insurance rejections and service failures' },
  { title: 'RTI & Govt Schemes', desc: 'Pensions, ration cards and entitlements unlocked' },
  { title: 'Diaspora & NRI', desc: 'Cross-border property and family matters for Indians abroad' },
  { title: 'Noted Judgments', desc: 'The rulings we argue by, annotated in plain words' },
];

const resourceShelves = [
  {
    title: 'Academics',
    sub: 'Blogs · Research · Papers',
    icon: 'grad',
    preview: 'Latest piece preview',
    links: ['Field notes from camps', 'Research & papers', 'Policy briefs'],
    cta: 'Open Academics',
    href: '/academics',
  },
  {
    title: 'Know Your Rights',
    sub: 'Guides · Glossary · Videos',
    icon: 'shield',
    preview: 'Latest guide preview',
    links: ['Downloadable guides', 'Legal glossary', 'Emergency contacts'],
    cta: 'Open Rights Desk',
    href: '/know-your-rights',
  },
  {
    title: 'Library',
    sub: 'Podcast · Films · Socials',
    icon: 'books',
    preview: 'Latest episode art',
    links: ['Noted judgments', 'Media coverage', 'Annual reports'],
    cta: 'Open Library',
    href: '/library',
  },
];

function StatIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    className: 'home-stat__svg',
  };

  if (name === 'heart') {
    return (
      <svg {...common}>
        <path d="M12 20.5s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10.5c0 5.6-7 10-7 10z" />
      </svg>
    );
  }
  if (name === 'scales') {
    return (
      <svg {...common}>
        <path d="M12 3v18M5 7h14M7 7l-3 8h6L7 7zm10 0l-3 8h6l-3-8zM8 21h8" />
      </svg>
    );
  }
  if (name === 'gavel') {
    return (
      <svg {...common}>
        <path d="M14 4l6 6M10 8l6 6M3 21h10M8 14l-5 5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 19c1.5-3 4-4.5 6-4.5S13.5 16 15 19M13 19c.8-2 2.2-3 3.5-3s2.4.8 3.5 3" />
    </svg>
  );
}

function ShelfIcon({ name }) {
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      </svg>
    );
  }
  if (name === 'books') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 5h6a2 2 0 012 2v12H6a2 2 0 01-2-2V5zm10 0h6v12a2 2 0 01-2 2h-4V7a2 2 0 012-2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 19v-9l8-4 8 4v9M4 10l8 4 8-4" />
    </svg>
  );
}

function MediaPlaceholder({ label, caption, ratio = '4 / 3' }) {
  return (
    <div className="home-ph" style={{ '--ph-ratio': ratio }}>
      <span className="home-ph__label">{label}</span>
      {caption ? <small className="home-ph__caption">{caption}</small> : null}
    </div>
  );
}

/** Square window + cover fill — every photo edges the frame the same way. */
function PolaroidPhoto({ src, label, focus = 'center center' }) {
  return (
    <div className="home-polaroid__media">
      <img
        className="home-polaroid__img"
        src={src}
        alt={label}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: focus }}
      />
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('who-we-are');
  const [featuredStories, setFeaturedStories] = useState(FALLBACK_STORIES);
  const [featuredProgrammes, setFeaturedProgrammes] = useState(FALLBACK_PROGRAMMES);

  useEffect(() => {
    publicApi
      .get('/success-stories')
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        // API returns newest first — feature the latest three
        setFeaturedStories(r.data.slice(0, 3).map(mapHomeStory));
      })
      .catch(() => {});

    publicApi
      .get('/desk-stories')
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        // Latest four programmes for the home feature strip
        setFeaturedProgrammes(r.data.slice(0, 4).map(mapHomeProgramme));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const nodes = sideNav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home home--v2">
      <section className="home-hero" aria-label="Home hero">
        <div className="home-hero__stage">
          <HeroSketch className="home-hero__sketch" />
          <h1 className="home-hero__tagline">
            <span className="home-hero__with">With You.</span>{' '}
            <span className="home-hero__for">For You.</span>{' '}
            <span className="home-hero__nyay">Nyaya Tak.</span>
          </h1>
        </div>

        <Reveal as="div" className="home-hero__stats" variant="up" delay={120}>
          <div className="container home-hero__stats-row">
            {introStats.map((stat, i) => (
              <article
                className="home-stat"
                key={stat.label}
                style={{ '--stat-delay': `${i * 120}ms` }}
              >
                <span className="home-stat__icon" aria-hidden="true">
                  <StatIcon name={stat.icon} />
                </span>
                <div>
                  <CountUp
                    className="home-stat__value"
                    end={stat.end}
                    suffix={stat.suffix}
                    duration={stat.duration}
                  />
                  <span className="home-stat__label">{stat.label}</span>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <nav className="home-rail" aria-label="Page sections">
        {sideNav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`home-rail__item ${activeSection === item.id ? 'is-active' : ''}`}
          >
            <span className="home-rail__dot" aria-hidden="true" />
            <span className="home-rail__label">{item.label}</span>
          </a>
        ))}
      </nav>

      <section id="who-we-are" className="home-who">
        <div className="container home-who__grid">
          <Reveal as="div" className="home-who__copy" variant="up">
            <p className="home-eyebrow">Who we are</p>
            <h2 className="home-display">A people’s law foundation, since 2016</h2>
            <p>
              Radhey Krishna Legal Aid Foundation removes the barriers that keep justice out of reach —
              paperwork, fees, fear, and distance from the courthouse.
            </p>
            <p>
              We stand with elders, workers, women, and families who cannot afford private counsel —
              from first consultation to the order that changes a life.
            </p>
            <a href="/about" className="home-text-link">
              Read our full story →
            </a>
          </Reveal>

          <Reveal as="div" className="home-who__media" variant="up" delay={120}>
            <div className="home-film">
              <div className="home-film__frame">
                <MediaPlaceholder label="Film still" caption="The first clinic, the founder at the table" ratio="16 / 10" />
                <span className="home-film__badge">Film · 3 min</span>
                <button type="button" className="home-film__play" aria-label="Play film (coming soon)" disabled>
                  <span />
                </button>
              </div>
              <p className="home-film__caption">The first clinic, told in three minutes.</p>
              <aside className="home-film__quote">
                “No one else’s story ends in the queue.”
              </aside>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="stories" className="home-stories-wrap">
        <div className="container">
          <header className="home-section-head">
            <div>
              <p className="home-eyebrow">Impact through Litigation</p>
              <h2 className="home-display">Real people. Real orders. Real relief.</h2>
            </div>
            <Link to="/impact#stories" className="home-pill">
              View all stories →
            </Link>
          </header>

          <div className="home-stories__grid">
            {featuredStories.map((story, i) => {
              const href = story.slug ? `/impact/stories/${story.slug}` : null;
              const inner = (
                <>
                  {story.heroImage ? (
                    <div
                      className="home-story__photo"
                      style={{ backgroundImage: `url(${story.heroImage})` }}
                      role="img"
                      aria-label={story.caption || story.title}
                    />
                  ) : (
                    <MediaPlaceholder label={story.visual} caption={story.caption} ratio="16 / 11" />
                  )}
                  <div className="home-story__body">
                    <span className="home-story__tag">{story.tag}</span>
                    <h3>{story.title}</h3>
                    {story.desc ? <p>{story.desc}</p> : null}
                    {href ? <span className="home-story__more">Read more →</span> : null}
                  </div>
                </>
              );

              return (
                <Reveal key={story.id || story.title} as="div" variant="up" delay={i * 90}>
                  {href ? (
                    <Link to={href} className="home-story home-story--link">
                      {inner}
                    </Link>
                  ) : (
                    <article className="home-story">{inner}</article>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Polaroids stay between success stories and programmes */}
      <div className="home-snapshots" aria-label="Field snapshots">
        {[
          { items: marqueeSet(snapshots, 14), reverse: false, tilt: 0 },
          { items: marqueeSet(snapshotsRow2, 14), reverse: true, tilt: 1 },
        ].map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`home-snapshots__row${row.reverse ? ' home-snapshots__row--reverse' : ''}`}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="home-snapshots__group"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {row.items.map((shot, i) => (
                  <figure
                    className={`home-polaroid home-polaroid--${((i + row.tilt) % 3) + 1}`}
                    key={`${rowIndex}-${copy}-${shot.label}-${i}`}
                  >
                    {shot.src ? (
                      <PolaroidPhoto src={shot.src} label={shot.label} focus={shot.focus} />
                    ) : (
                      <MediaPlaceholder label={shot.label} />
                    )}
                    <figcaption>{shot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <section id="programmes" className="home-impact">
        <div className="container">
          <header className="home-section-head">
            <div>
              <p className="home-eyebrow">Our Work</p>
              <h2 className="home-display">Programmes &amp; Initiatives</h2>
            </div>
            <Link to="/our-work/programmes" className="home-pill">
              View all programmes →
            </Link>
          </header>

          <div className="home-impact__grid">
            {featuredProgrammes.map((item, i) => {
              const href = item.slug ? `/our-work/desk/${item.slug}` : '/our-work/programmes';
              return (
                <Reveal key={item.id || item.num} as="div" variant="up" delay={i * 80}>
                  <Link to={href} className="home-card home-card--link">
                    <div className="home-card__visual">
                      {item.heroImage ? (
                        <div
                          className="home-card__photo"
                          style={{ backgroundImage: `url(${item.heroImage})` }}
                          role="img"
                          aria-label={item.title}
                        />
                      ) : (
                        <MediaPlaceholder label={item.visual} caption={item.caption} />
                      )}
                      <span className="home-card__num">{item.num}</span>
                    </div>
                    <div className="home-card__body">
                      <span className="home-card__tag">{item.tag}</span>
                      <h3>{item.title}</h3>
                      {item.desc ? <p>{item.desc}</p> : null}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="expertise" className="home-expertise">
        <div className="container home-expertise__grid">
          <Reveal as="div" className="home-expertise__intro" variant="up">
            <p className="home-eyebrow">Expertise</p>
            <h2 className="home-display">Where we can step in</h2>
            <p>
              Eight areas of practice, each with its own desk, its own guides, and its own case record.
            </p>
          </Reveal>

          <ul className="home-expertise__list">
            {expertise.map((item, i) => (
              <li key={item.title}>
                <a href="#expertise" className="home-expertise__row">
                  <span className="home-expertise__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="home-expertise__title">{item.title}</span>
                  <span className="home-expertise__desc">{item.desc}</span>
                  <span className="home-expertise__arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="resources" className="home-resources">
        <div className="container">
          <header className="home-resources__head">
            <p className="home-eyebrow">Resources</p>
            <h2 className="home-display">Three shelves, always open.</h2>
          </header>

          <div className="home-resources__grid">
            {resourceShelves.map((shelf, i) => (
              <Reveal as="article" className="home-shelf" key={shelf.title} variant="up" delay={i * 80}>
                <header className="home-shelf__head">
                  <span className="home-shelf__icon" aria-hidden="true">
                    <ShelfIcon name={shelf.icon} />
                  </span>
                  <div>
                    <h3>{shelf.title}</h3>
                    <p>{shelf.sub}</p>
                  </div>
                </header>
                <MediaPlaceholder label={shelf.preview} ratio="16 / 8" />
                <ul className="home-shelf__links">
                  {shelf.links.map((label) => (
                    <li key={label}>
                      <a href={shelf.href}>
                        <span aria-hidden="true">↗</span> {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={shelf.href} className="home-pill home-pill--block">
                  {shelf.cta} →
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="join-help" className="home-cta-band">
        <div className="container home-cta-band__grid">
          <article className="home-cta home-cta--dark">
            <svg className="home-cta__mark" viewBox="0 0 64 64" aria-hidden="true">
              <path fill="currentColor" d="M32 10c-6 8-14 14-14 24a14 14 0 0028 0c0-10-8-16-14-24z" opacity=".18" />
            </svg>
            <h2 className="home-display">Need help now?</h2>
            <p>Call, message or walk into a camp. A volunteer triages every request within 24 hours.</p>
            <div className="home-cta__actions">
              <a href={CONTACT_PHONE_TEL} className="home-pill home-pill--light">Call helpline</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="home-pill home-pill--light">
                WhatsApp us
              </a>
            </div>
          </article>

          <article className="home-cta home-cta--tan">
            <svg className="home-cta__mark" viewBox="0 0 64 64" aria-hidden="true">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M18 34c4-8 10-12 14-12s10 4 14 12M22 38h20" opacity=".35" />
            </svg>
            <h2 className="home-display">Join us</h2>
            <p>
              Volunteer from 2 hours a week, intern in a 4 to 12 week cohort, or become a member from ₹500 a month.
            </p>
            <Link to="/join-us" className="home-pill home-pill--dark">Get involved →</Link>
          </article>
        </div>

        <div className="container">
          <article id="donate" className="home-donate">
            <div>
              <h2 className="home-display">Your donation funds someone’s day in court</h2>
              <p>
                ₹1,500 covers one full case filing. ₹500 runs a village rights camp for an hour.
                Every rupee is accounted for in our public ledger.
              </p>
            </div>
            <Link to="/donate" className="home-pill home-pill--light home-donate__btn">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Donate now →
            </Link>
          </article>
        </div>
      </section>

      <section id="contact-home" className="home-contact">
        <div className="container home-contact__grid">
          <a href={CONTACT_PHONE_TEL} className="home-contact__item">
            <span className="home-contact__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.35a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.75.34 1.54.57 2.35.7A2 2 0 0122 16.92z" />
              </svg>
            </span>
            <div className="home-contact__body">
              <strong>Helpline</strong>
              <span>{WHATSAPP_DISPLAY}</span>
              <small>Mon to Sat, 9 to 6</small>
            </div>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="home-contact__item">
            <span className="home-contact__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </span>
            <div className="home-contact__body">
              <strong>WhatsApp</strong>
              <span>{WHATSAPP_DISPLAY}</span>
            </div>
          </a>
          <a href={CONTACT_MAILTO} className="home-contact__item">
            <span className="home-contact__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 7 9-7" />
              </svg>
            </span>
            <div className="home-contact__body">
              <strong>Email</strong>
              <span>{CONTACT_EMAIL}</span>
            </div>
          </a>
          <a
            href={OFFICE_DELHI.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="home-contact__item"
          >
            <span className="home-contact__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <div className="home-contact__body">
              <strong>Head office</strong>
              <span>{OFFICE_DELHI.short}</span>
              <small>Walk-in Tue &amp; Thu · Open map</small>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
