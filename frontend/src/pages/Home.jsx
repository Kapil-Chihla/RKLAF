import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroVideo from '../components/home/HeroVideo';
import CountUp from '../components/motion/CountUp';
import Reveal from '../components/motion/Reveal';
import { WHATSAPP_URL } from '../data/navigation';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { renderRichText } from '../lib/richText';
import { sortDeskStoriesLatest } from '../data/deskStories';
import academicsHomeImg from '../assets/academicshomebanner.jpeg';
import knowYourRightsHomeImg from '../assets/kyrhomebanner.jpeg';
import libraryHomeImg from '../assets/libraryhomebanner.jpeg';
import whoWeAreFilm from '../assets/homepagevideonew.mp4';
import whoWeArePoster from '../assets/homepagevideonew.jpg';
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
  {
    header: 'Since 2016',
    end: 30000,
    suffix: '+',
    label: 'Hours of Pro Bono Legal Service',
    icon: 'scales',
    duration: 2200,
  },
  {
    header: 'Assisted',
    end: 12750,
    suffix: '+',
    label: 'Individuals & Families assisted through direct legal representation and free consultation',
    icon: 'people',
    duration: 2000,
  },
  {
    header: 'Reach',
    end: 100000,
    suffix: '+',
    label:
      'People reached and benefited through our litigation, our jail visits, legal aid camps, outreach and other programmes.',
    icon: 'heart',
    duration: 2200,
  },
];

const sideNav = [
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'stories', label: 'What we do' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'resources', label: 'Resources' },
  { id: 'join-help', label: 'Join Us & Help' },
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
  {
    title: 'Constitutional & Public Law',
    desc: 'Writ petitions and constitutional matters before the Hon\'ble High Courts and Supreme Court',
  },
  {
    title: 'Public Interest Litigation',
    desc: 'Causes of public importance before the Hon\'ble High Courts and Supreme Court',
  },
  {
    title: 'Human Rights & Vulnerable Communities',
    desc: 'Undertrials, senior citizens, women, children and other marginalized groups',
  },
  {
    title: 'Criminal & Custodial Justice',
    desc: 'Bail, trial representation and appeals, including in-jail legal aid for undertrials',
  },
  {
    title: 'Labour & Employment',
    desc: 'Unpaid wages, wrongful termination and workplace entitlements',
  },
  {
    title: 'Public Employment & Service Matters',
    desc: 'Recruitment, promotions, disciplinary proceedings and pension disputes',
  },
  {
    title: 'Environmental Law',
    desc: 'Environmental protection and public interest matters affecting communities and ecosystems',
  },
  {
    title: 'Cyber Law',
    desc: 'Cybercrime, digital offences and matters arising from online conduct',
  },
];

const resourceShelves = [
  {
    title: 'Academic',
    sub: 'Research · Publications · Reports',
    icon: 'grad',
    image: academicsHomeImg,
    imageAlt: 'Academics — blogs, research and papers',
    imagePosition: 'down',
    links: [
      'Research, publications, reports and academic resources for those looking to explore law and public policy in greater depth.',
    ],
    cta: 'Explore Academic Resources',
    href: '/academics',
  },
  {
    title: 'Know Your Rights',
    sub: 'Guides · Glossary · Videos',
    icon: 'shield',
    image: knowYourRightsHomeImg,
    imageAlt: 'Know Your Rights — guides, glossary and videos',
    imagePosition: 'down',
    links: [
      'Practical, accessible and simplified legal information explaining the rights and remedies that affect people in everyday life.',
    ],
    cta: 'Know Your Rights',
    href: '/know-your-rights',
  },
  {
    title: 'Library',
    sub: 'Podcast · Films · Socials',
    icon: 'books',
    image: libraryHomeImg,
    imageAlt: 'Library — podcast, films and socials',
    links: [
      'A growing collection of legal and educational resources bringing together materials for learning, research and public awareness.',
    ],
    cta: 'Visit the Library',
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

function WhoWeAreFilm() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => {
        el.muted = true;
        el.play()
          .then(() => {
            setPlaying(true);
            el.muted = false;
          })
          .catch(() => {});
      });
  };

  return (
    <div className={`home-film${playing ? ' is-playing' : ''}`}>
      <div className="home-film__frame">
        <video
          ref={videoRef}
          className="home-film__video"
          src={whoWeAreFilm}
          poster={whoWeArePoster}
          controls={playing}
          controlsList="nodownload"
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
          onPause={() => {
            const el = videoRef.current;
            if (el && el.paused && !el.ended) setPlaying(false);
          }}
          onPlay={() => setPlaying(true)}
        />
        {!playing ? <span className="home-film__badge">Film · 3 min</span> : null}
        {!playing ? (
          <button type="button" className="home-film__play" onClick={start} aria-label="Play film">
            <span />
          </button>
        ) : null}
      </div>
      <p className="home-film__caption">With You. For You. Nyaya Tak.</p>
      {!playing ? (
        <aside className="home-film__quote">
          “Justice must remain within the reach of those who need it, not only those who can afford it.”
        </aside>
      ) : null}
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
        setFeaturedProgrammes(sortDeskStoriesLatest(r.data).slice(0, 3).map(mapHomeProgramme));
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
          <div className="home-hero__art">
            <HeroVideo className="home-hero__media" />
            <h1 className="home-hero__tagline">
              <span className="home-hero__with">With You.</span>{' '}
              <span className="home-hero__for">For You.</span>{' '}
              <span className="home-hero__nyay">Nyaya Tak.</span>
            </h1>
          </div>
        </div>

        <div className="home-hero__stats">
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
                <div className="home-stat__body">
                  <em className="home-stat__header">{stat.header}</em>
                  <CountUp
                    className="home-stat__value"
                    end={stat.end}
                    suffix={stat.suffix}
                    duration={stat.duration}
                    startOnMount
                  />
                  <span className="home-stat__label">{stat.label}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
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
            <blockquote className="home-who__quote">
              “Justice must remain within the reach of those who need it, not only those who can afford it.”
            </blockquote>
            <p>
              “RKLAF was founded in the loving memory of my parents, Late Sh. R.S. Garg, Advocate, and Late
              Smt. Krishna Garg, whose lives embodied the belief that law must remain accessible to those who
              need it most.
            </p>
            <p>
              Since 2016, RKLAF has carried that belief forward through free legal aid, public-interest
              litigation, legal literacy, community outreach, research, and institutional interventions. Our
              work is guided by a simple conviction: access to justice should never depend on one&apos;s
              ability to pay.
            </p>
            <p>
              We hope this platform helps more people understand their rights, discover that help is
              available, and join us in the continuing pursuit of justice for all.”
            </p>
            <p className="home-who__byline">
              Mr. Ajay Garg
              <br />
              Advocate, Supreme Court of India &amp; Delhi High Court
              <br />
              Founder, Radhey Krishna Legal Aid Foundation
            </p>
            <a href="/about" className="home-text-link">
              Read our full story →
            </a>
          </Reveal>

          <Reveal as="div" className="home-who__media" variant="up" delay={120}>
            <WhoWeAreFilm />
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
                    {story.desc ? <p>{renderRichText(story.desc)}</p> : null}
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
                      {item.desc ? <p>{renderRichText(item.desc)}</p> : null}
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
          </Reveal>

          <ul className="home-expertise__list">
            {expertise.map((item, i) => (
              <li key={item.title}>
                <a href="#expertise" className="home-expertise__row">
                  <span className="home-expertise__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="home-expertise__title">{item.title}</span>
                  <span className="home-expertise__desc">{renderRichText(item.desc)}</span>
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
            <h2 className="home-display">Knowledge Should Be Accessible.</h2>
            <p className="home-resources__lede">
              Legal knowledge should not remain confined to courtrooms, textbooks or legal databases. RKLAF
              creates and curates resources that help students, researchers, professionals and members of the
              public understand the law and engage with issues that affect society.
            </p>
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
                <div
                  className={`home-shelf__photo${shelf.imagePosition === 'down' ? ' home-shelf__photo--down' : ''}`}
                >
                  <img src={shelf.image} alt={shelf.imageAlt} loading="lazy" decoding="async" />
                </div>
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
            <h2 className="home-display">Have a Question? Need Assistance? Let&apos;s Talk.</h2>
            <p>
              Whether you are seeking legal assistance, have a question about our programmes, wish to
              collaborate, or simply want to learn more about RKLAF, we welcome you to reach out.
            </p>
            <div className="home-cta__actions">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="home-pill home-pill--light">
                Request Legal Assistance
              </a>
              <Link to="/contact" className="home-pill home-pill--light">
                Contact Us
              </Link>
            </div>
          </article>

          <article className="home-cta home-cta--tan">
            <svg className="home-cta__mark" viewBox="0 0 64 64" aria-hidden="true">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M18 34c4-8 10-12 14-12s10 4 14 12M22 38h20" opacity=".35" />
            </svg>
            <h2 className="home-display">There Is a Place for You in This Work.</h2>
            <p>
              Justice is built by people who choose to contribute their time, knowledge, skills and resources.
              Volunteer, intern, become a member, or partner with us.
            </p>
            <Link to="/join-us" className="home-pill home-pill--dark">Find Your Way to Contribute →</Link>
          </article>
        </div>

        <div className="container">
          <article id="donate" className="home-donate">
            <div>
              <h2 className="home-display">Justice Should Never Depend on What Someone Can Afford.</h2>
              <p>
                Your contribution helps RKLAF continue providing free legal aid, legal awareness, community
                outreach, research and public-interest initiatives to those who need them. A contribution to
                RKLAF is support for the principle that legal protection should be available to everyone.
              </p>
            </div>
            <Link to="/donate" className="home-pill home-pill--light home-donate__btn">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Donate to RKLAF →
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
