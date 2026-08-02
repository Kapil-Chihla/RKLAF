import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import './Library.css';

const platforms = [
  { label: 'Listen on Spotify', href: '#', icon: 'note' },
  { label: 'Apple Podcasts', href: '#', icon: 'note' },
  { label: 'YouTube', href: 'https://www.youtube.com/@radheykrishnalegalaid', icon: 'play' },
];

const episodes = [
  {
    tag: 'Senior Citizens',
    title: 'Can your children legally evict you?',
    blurb: 'Maintenance, gift deeds, and what the tribunal can order when a home becomes a storeroom.',
  },
  {
    tag: 'Criminal Law',
    title: 'Filing an FIR that actually sticks',
    blurb: 'Zero FIR, refusals at the desk, and walking out with your free copy.',
  },
  {
    tag: 'Camps',
    title: 'A Saturday under the banyan',
    blurb: 'How a mobile camp routes by helpline demand — and what happens after the tent comes down.',
  },
];

const socialShelves = [
  {
    name: 'LinkedIn',
    sub: 'Articles & threads',
    cta: 'Follow →',
    href: '#',
    preview: 'Latest post preview',
    links: ['Maintenance orders that stick', 'Impact report highlights', 'We are hiring fellows'],
  },
  {
    name: 'YouTube',
    sub: 'Explainers & shorts',
    cta: 'Subscribe →',
    href: 'https://www.youtube.com/@radheykrishnalegalaid',
    preview: 'Latest video thumbnail',
    links: ['Senior Citizens Act in 8 min', 'Your first day in court', 'Reading a gift deed'],
  },
  {
    name: 'Facebook',
    sub: 'Camps & community',
    cta: 'Follow →',
    href: 'https://facebook.com/',
    preview: 'Latest post preview',
    links: ['This weekend’s camp dates', 'Live Q&A with advocates', 'Photo album from Rewari'],
  },
  {
    name: 'Instagram',
    sub: 'Rights in frames',
    cta: 'Follow →',
    href: 'https://www.instagram.com/rklegalaidfoundation',
    preview: 'Latest post preview',
    links: ['Tenant rights carousel', 'Pension rights checklist', 'Camp diary stories'],
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

function Waveform() {
  const bars = [8, 14, 10, 18, 12, 22, 16, 9, 20, 13, 17, 11, 19, 8, 15, 21, 12, 18, 10, 16, 14, 9, 20, 11, 17];
  return (
    <div className="lib-wave" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

export default function Library() {
  return (
    <div className="lib">
      {/* Podcast hero */}
      <header className="lib-hero">
        <div className="container lib-hero__grid">
          <Reveal as="div" className="lib-hero__copy" variant="up">
            <p className="lib-label lib-label--on-dark">Our podcast</p>
            <h1>
              Nyay Ki Baat, law for <em>curious minds</em>
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
            <span>Host photo placeholder</span>
            <small>Studio portrait with headphones, warm light, cut out over the band.</small>
          </Reveal>
        </div>
      </header>

      {/* Floating player + welcome */}
      <section className="lib-welcome">
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

          <div className="lib-welcome__grid">
            <Reveal as="div" className="lib-welcome__visual" variant="left" aria-hidden="true">
              <div className="lib-blob">
                <span>Photo placeholder</span>
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
                odcasts in Hindi and English, short enough for a bus ride, clear enough to act on. Press play,
                then take the next step — a guide, a helpline call, or a camp near you.
              </p>
              <Link to="/contact" className="lib-pill">
                Get in touch →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Latest episodes */}
      <section id="episodes" className="lib-episodes">
        <div className="container">
          <div className="lib-episodes__head">
            <div>
              <p className="lib-label">Latest episodes</p>
              <h2>Fresh from the studio</h2>
            </div>
            <a href="#episodes" className="lib-browse">
              Browse all →
            </a>
          </div>

          <div className="lib-episodes__grid">
            {episodes.map((ep, i) => (
              <Reveal key={ep.title} as="article" className="lib-ep" variant="up" delay={i * 50}>
                <div className="lib-ep__art" aria-hidden="true">
                  <span>EP art</span>
                  <span className="lib-ep__play">▶</span>
                </div>
                <div className="lib-ep__body">
                  <p className="lib-ep__tag">{ep.tag}</p>
                  <h3>{ep.title}</h3>
                  <p>{ep.blurb}</p>
                  <a href="#episodes" className="lib-ep__cta">
                    View episode →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Listeners */}
      <section className="lib-listeners">
        <div className="container lib-listeners__inner">
          <Reveal as="div" variant="up">
            <span className="lib-quote-mark" aria-hidden="true">
              ”
            </span>
            <p className="lib-label">What listeners say</p>
            <div className="lib-listeners__wave">
              <Waveform />
              <div className="lib-listeners__avatar" aria-hidden="true">
                SS
              </div>
              <Waveform />
            </div>
            <p className="lib-listeners__name">Sunita Sharma</p>
            <p className="lib-listeners__meta">Listener · Faridabad</p>
            <blockquote>
              I heard episode 38 in an auto. The next week I filed my own FIR, correctly, on the first try. My
              daughter could not believe it.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Socials */}
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
                  <span className="lib-social__icon" aria-hidden="true">
                    {s.name.slice(0, 1)}
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

      {/* Donate band */}
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
