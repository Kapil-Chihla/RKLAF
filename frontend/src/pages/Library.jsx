import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import { socialLinks } from '../data/navigation';
import './Library.css';

const LIB_BROWSE = [
  { id: 'podcast', num: '01', label: 'Our Podcast' },
  { id: 'socials', num: '02', label: 'Our Socials' },
];

const platforms = [
  { label: 'Listen on Spotify', href: 'https://open.spotify.com/', icon: 'note' },
  { label: 'Apple Podcasts', href: '#', icon: 'note' },
  { label: 'YouTube', href: 'https://www.youtube.com/@radheykrishnalegalaid', icon: 'play' },
];

const audioPlatforms = [
  { label: 'Spotify', href: 'https://open.spotify.com/', icon: '♫' },
  { label: 'Apple Podcasts', href: '#', icon: '◉' },
  { label: 'JioSaavn', href: '#', icon: '♬' },
  { label: 'Amazon Music', href: '#', icon: '◈' },
];

const audioEpisodes = [
  {
    tag: 'Senior Citizens',
    title: 'Can your children legally evict you?',
    blurb: 'Section 23, coerced gift deeds, and a 63-day restoration story.',
    dur: 'EP 41 · 28 MIN',
  },
  {
    tag: 'Labour',
    title: 'Wages you are owed',
    blurb: 'Building a claim from screenshots, with the interns who did it.',
    dur: 'EP 40 · 34 MIN',
  },
  {
    tag: 'From the Bench',
    title: 'A tribunal member speaks',
    blurb: 'What actually persuades, from the other side of the dais.',
    dur: 'EP 39 · 41 MIN',
  },
];

const videoFeatured = {
  tag: 'Latest episode',
  title: 'Arrested at night: what the law actually requires',
  blurb:
    'An advocate and a former investigating officer walk through the first hour after an arrest, the arrest memo, and the questions a family should ask at the station.',
  meta: ['EPISODE 12', 'FILMED AT THE OFFICE', 'SUBTITLES IN HINDI'],
  duration: '46:12',
};

const videoList = [
  { tag: 'Explainer', title: 'Zero FIR in three minutes', dur: '3:12 · 41K views' },
  { tag: 'Interview', title: 'Inside the prison legal aid desk', dur: '22:40 · 9.8K views' },
  { tag: 'From the camps', title: 'A day at a village legal aid camp', dur: '14:05 · 12K views' },
];

const socialShelves = [
  {
    name: 'LinkedIn',
    sub: 'Articles & threads',
    cta: 'Follow →',
    href: socialLinks.find((s) => s.name === 'LinkedIn')?.href || '#',
    icon: 'in',
    tone: 'li',
    preview: 'Latest post preview',
    links: [
      'Why 94% of our maintenance orders get paid',
      'Annual impact report, the thread',
      'Hiring: 2026 internship cohort',
    ],
  },
  {
    name: 'YouTube',
    sub: 'Films & explainers',
    cta: 'Subscribe →',
    href: 'https://www.youtube.com/@radheykrishnalegalaid',
    icon: '▶',
    tone: 'yt',
    preview: 'Latest video thumbnail',
    links: ['The Senior Citizens Act in 8 minutes', 'Your first day in court', 'How legal aid camps work'],
  },
  {
    name: 'Facebook',
    sub: 'Community & camps',
    cta: 'Follow →',
    href: 'https://facebook.com/',
    icon: 'f',
    tone: 'fb',
    preview: 'Latest post preview',
    links: [
      'Camp announcements, district by district',
      'Live Q&A every second Sunday',
      'Photo albums from oath day',
    ],
  },
  {
    name: 'Instagram',
    sub: 'Reels & rights cards',
    cta: 'Follow →',
    href: 'https://www.instagram.com/rklegalaidfoundation',
    icon: '◎',
    tone: 'ig',
    preview: 'Latest reel cover',
    links: [
      '3 documents every tenant must keep',
      'Rights card: pension edition',
      'Volunteer diaries, week 12',
    ],
  },
];

function PlatformIcon({ name }) {
  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7L8 5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2.5" />
      <circle cx="17" cy="16" r="2.5" />
    </svg>
  );
}

export default function Library() {
  const [activeBrowse, setActiveBrowse] = useState(LIB_BROWSE[0].id);

  useEffect(() => {
    const nodes = LIB_BROWSE.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveBrowse(visible[0].target.id);
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.08, 0.25, 0.45] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveBrowse(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="lib">
      <header className="lib-hero">
        <div className="container lib-hero__grid">
          <Reveal as="div" className="lib-hero__copy" variant="up">
            <p className="lib-label lib-label--on-dark">Our podcast</p>
            <h1>
              Nyay Ki Baat,
              <br />
              law for <em>curious minds</em>
            </h1>
            <p className="lib-hero__lead">
              Plain-spoken conversations on the rights that shape everyday life, recorded with advocates,
              tribunal members and the people we serve.
            </p>
            <div className="lib-platforms">
              {platforms.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  className="lib-platform"
                  {...(p.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <PlatformIcon name={p.icon} />
                  {p.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal as="div" className="lib-hero__photo" variant="scale" delay={60} aria-hidden="true">
            <span className="lib-hero__halo" />
            <span>Host photo placeholder</span>
            <small>Studio portrait with headphones, warm light, cut out over the band.</small>
          </Reveal>
        </div>
      </header>

      {/* Player bridges hero → page; kept above sticky browse so the title isn’t clipped */}
      <div className="lib-player-bridge">
        <div className="container">
          <Reveal as="div" className="lib-player" variant="up">
            <div className="lib-player__art" aria-hidden="true">
              EP art
            </div>
            <div className="lib-player__body">
              <p className="lib-player__meta">Senior Citizens · Ep. 42</p>
              <h2>Can your children legally evict you?</h2>
              <div className="lib-player__controls">
                <button type="button" className="lib-player__play" aria-label="Play episode">
                  ▶
                </button>
                <div className="lib-player__bar" aria-hidden="true">
                  <span style={{ width: '36%' }} />
                </div>
                <span className="lib-player__time">03:12 / 08:40</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <nav className="lib-browse" aria-label="Browse Library">
        <div className="container lib-browse__inner">
          {LIB_BROWSE.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`lib-browse__tab${activeBrowse === tab.id ? ' is-active' : ''}`}
              onClick={() => scrollToSection(tab.id)}
              aria-current={activeBrowse === tab.id ? 'true' : undefined}
            >
              <span className="lib-browse__num">{tab.num}</span>
              <span className="lib-browse__label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div id="podcast" className="lib-podcast-block">
        <section className="lib-welcome">
          <div className="container">
            <div className="lib-welcome__grid">
              <Reveal as="div" className="lib-welcome__visual" variant="left" aria-hidden="true">
                <div className="lib-blob">
                  <span>Photo placeholder</span>
                  <small>Listener at a camp, headphones on</small>
                </div>
                <div className="lib-blob-ring" />
                <span className="lib-dot lib-dot--a" />
                <span className="lib-dot lib-dot--b" />
              </Reveal>

              <Reveal as="div" className="lib-welcome__copy" variant="up" delay={40}>
                <p className="lib-label">Welcome</p>
                <h2>A library you can listen to</h2>
                <p className="lib-welcome__italic">
                  Our pick of episodes and posts covering rights, rulings and life around the courts.
                </p>
                <p className="lib-welcome__body">
                  <span className="lib-drop" aria-hidden="true">
                    P
                  </span>
                  odcasts travel where pamphlets cannot. A daughter in Dubai shares an episode with her mother
                  in Mathura; a rickshaw driver listens between fares. Every episode is short, in plain Hindi
                  and English, and ends with one thing you can do this week.
                </p>
                <Link to="/contact" className="lib-pill">
                  Get in touch →
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="audio" className="lib-episodes">
          <div className="container">
            <div className="lib-episodes__head">
              <div>
                <p className="lib-label">Listen</p>
                <h2>The audio podcast</h2>
                <p className="lib-episodes__lede">
                  Conversations recorded at the office and in the field, for listening on the way to work. New
                  episode every fortnight.
                </p>
              </div>
              <a href="#audio" className="lib-browse-link">
                All audio episodes →
              </a>
            </div>

            <div className="lib-platforms lib-platforms--light">
              {audioPlatforms.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  className="lib-platform lib-platform--light"
                  {...(p.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <i aria-hidden="true">{p.icon}</i>
                  {p.label}
                </a>
              ))}
            </div>

            <div className="lib-episodes__grid">
              {audioEpisodes.map((ep, i) => (
                <Reveal key={ep.title} as="article" className="lib-ep" variant="up" delay={i * 50}>
                  <div className="lib-ep__art" aria-hidden="true">
                    <span>EP art</span>
                    <span className="lib-ep__play">▶</span>
                  </div>
                  <div className="lib-ep__body">
                    <p className="lib-ep__tag">{ep.tag}</p>
                    <h3>{ep.title}</h3>
                    <p>{ep.blurb}</p>
                    <span className="lib-ep__dur">{ep.dur}</span>
                    <a href="#audio" className="lib-ep__cta">
                      Listen →
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="video" className="lib-video">
          <div className="container">
            <div className="lib-episodes__head">
              <div>
                <p className="lib-label">Watch</p>
                <h2>The video podcast</h2>
                <p className="lib-episodes__lede">
                  Full episodes filmed in the studio, plus short explainers you can send to someone who needs
                  the answer today.
                </p>
              </div>
              <a href="#video" className="lib-browse-link">
                All video episodes →
              </a>
            </div>

            <div className="lib-video__grid">
              <Reveal as="article" className="lib-video__main" variant="up">
                <div className="lib-video__frame">
                  <span className="lib-video__tag">{videoFeatured.tag}</span>
                  <div className="lib-video__ph" aria-hidden="true">
                    <span>Video embed placeholder</span>
                    <small>Studio conversation, two-camera setup</small>
                  </div>
                  <div className="lib-video__play" aria-hidden="true">
                    <i>▶</i>
                  </div>
                  <span className="lib-video__badge">{videoFeatured.duration}</span>
                </div>
                <div className="lib-video__body">
                  <h3>{videoFeatured.title}</h3>
                  <p>{videoFeatured.blurb}</p>
                  <div className="lib-video__meta">
                    {videoFeatured.meta.map((m, i) => (
                      <span key={m}>
                        {i > 0 ? <span aria-hidden="true"> · </span> : null}
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <div className="lib-video__list">
                {videoList.map((v, i) => (
                  <Reveal key={v.title} as="article" className="lib-video__item" variant="up" delay={i * 40}>
                    <div className="lib-video__thumb" aria-hidden="true">
                      <span>Still</span>
                      <span className="lib-ep__play">▶</span>
                    </div>
                    <div>
                      <p className="lib-ep__tag">{v.tag}</p>
                      <h4>{v.title}</h4>
                      <span className="lib-ep__dur">{v.dur}</span>
                    </div>
                  </Reveal>
                ))}
                <a
                  className="lib-ytpill"
                  href="https://www.youtube.com/@radheykrishnalegalaid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶ Subscribe on YouTube
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <svg className="lib-flow" viewBox="0 0 1240 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="#EFEAE0"
          d="M0 42 q160 -38 340 -16 q180 22 340 -8 q180 -32 360 -4 q110 16 200 4 L1240 60 L0 60 Z"
        />
      </svg>

      <section id="socials" className="lib-socials">
        <div className="container">
          <Reveal as="header" className="lib-socials__head" variant="up">
            <p className="lib-label">Our socials</p>
            <h2>The same knowledge, wherever you scroll</h2>
          </Reveal>

          <div className="lib-socials__grid">
            {socialShelves.map((s, i) => (
              <Reveal key={s.name} as="article" className="lib-social" variant="up" delay={i * 40}>
                <header className="lib-social__head">
                  <span className={`lib-social__icon lib-social__icon--${s.tone}`} aria-hidden="true">
                    {s.icon}
                  </span>
                  <div>
                    <h3>{s.name}</h3>
                    <p>{s.sub}</p>
                  </div>
                </header>
                <div className="lib-social__preview" aria-hidden="true">
                  <span>{s.preview}</span>
                </div>
                <ul>
                  {s.links.map((link) => (
                    <li key={link}>
                      <a href={s.href}>
                        <span aria-hidden="true">↗</span> {link}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={s.href}
                  className="lib-social__cta"
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {s.cta}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="lib-donate">
        <div className="container lib-donate__inner">
          <Reveal as="div" variant="up">
            <h2>Listen, share, support the work</h2>
            <p className="lib-donate__ph">
              Background photo placeholder · Studio microphone &amp; recorder, shallow depth
            </p>
            <Link to="/donate" className="lib-pill lib-pill--light">
              Donate to keep it free →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
