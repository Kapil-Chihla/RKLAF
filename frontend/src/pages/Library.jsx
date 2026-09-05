import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import {
  socialLinks,
  SPOTIFY_PROFILE_URL,
  YOUTUBE_CHANNEL_URL,
} from '../data/navigation';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import {
  cloudShareLabel,
  isAudioMediaUrl,
  isCloudSharePageUrl,
  isHttpUrl,
  mediaEmbedUrl,
  toDirectMediaUrl,
} from '../lib/mediaEmbed';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import libraryBanner from '../assets/librarybanner.jpeg';
import libraryPlaceholder from '../assets/libraryplaceholder.jpeg';
import libraryYoutube from '../assets/libraryyoutube.jpeg';
import libraryLinkedin from '../assets/librarylinkedin.jpeg';
import libraryFacebook from '../assets/libraryfacebook.jpeg';
import libraryInstagram from '../assets/libraryinstagram.jpeg';
import './Library.css';

const LIB_BROWSE = [
  { id: 'podcast', num: '01', label: 'Our Podcast' },
  { id: 'socials', num: '02', label: 'Our Socials' },
];

const platforms = [
  { label: 'Listen on Spotify', href: SPOTIFY_PROFILE_URL, icon: 'note' },
  { label: 'YouTube', href: YOUTUBE_CHANNEL_URL, icon: 'play' },
];

const audioPlatforms = [{ label: 'Spotify', href: SPOTIFY_PROFILE_URL, icon: '♫' }];

const socialShelves = [
  {
    name: 'Instagram',
    blurb: 'Legal explainers, visual stories, campaigns and updates from our work.',
    cta: 'Follow RKLAF →',
    href: socialLinks.find((s) => s.name === 'Instagram')?.href || '#',
    icon: '◎',
    tone: 'ig',
    preview: 'Latest reel cover',
    previewImage: libraryInstagram,
  },
  {
    name: 'Facebook',
    blurb: 'Community updates, initiatives, events and accessible legal information.',
    cta: 'Follow RKLAF →',
    href: socialLinks.find((s) => s.name === 'Facebook')?.href || '#',
    icon: 'f',
    tone: 'fb',
    preview: 'Latest post preview',
    previewImage: libraryFacebook,
  },
  {
    name: 'LinkedIn',
    blurb: 'Institutional updates, research, collaborations, opportunities and professional developments.',
    cta: 'Follow RKLAF →',
    href: socialLinks.find((s) => s.name === 'LinkedIn')?.href || '#',
    icon: 'in',
    tone: 'li',
    preview: 'Latest post preview',
    previewImage: libraryLinkedin,
  },
  {
    name: 'YouTube',
    blurb: 'Nyaya Tak, legal explainers, conversations, discussions and other video content from RKLAF.',
    cta: 'Follow RKLAF →',
    href: YOUTUBE_CHANNEL_URL,
    icon: '▶',
    tone: 'yt',
    preview: 'Latest video thumbnail',
    previewImage: libraryYoutube,
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

/** Renders Spotify/YouTube iframe or native audio/video from CMS file or pasted URL. */
function PodcastMedia({ item, className = '', autoplay = false, compact = false }) {
  if (!item) return null;
  const fileUrl = assetUrl(item.media);
  const external = (item.externalUrl || '').trim();
  const embed = mediaEmbedUrl(external, { autoplay });
  const direct = fileUrl || toDirectMediaUrl(external);
  // Never put OneDrive/SharePoint viewer pages into <video> — browsers cannot play them
  const playUrl =
    direct ||
    (isHttpUrl(external) && !isCloudSharePageUrl(external) && !mediaEmbedUrl(external) ? external : null);

  if (embed) {
    return (
      <div className={`lib-media lib-media--embed${compact ? ' lib-media--compact' : ''} ${className}`.trim()}>
        <iframe
          src={embed}
          title={item.title || 'Podcast'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (playUrl) {
    const asAudio = item.kind === 'audio' || isAudioMediaUrl(playUrl);
    if (asAudio) {
      return (
        <div className={`lib-media lib-media--audio ${className}`.trim()}>
          <audio controls src={playUrl} preload="metadata">
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }
    return (
      <div className={`lib-media lib-media--video ${className}`.trim()}>
        <video
          controls
          src={playUrl}
          playsInline
          preload="metadata"
          poster={assetUrl(item.thumbnail) || (item.kind === 'video' ? libraryYoutube : undefined)}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  if (external && isCloudSharePageUrl(external)) {
    const where = cloudShareLabel(external);
    return (
      <div className={`lib-media lib-media--external ${className}`.trim()}>
        <p>
          This {where} share link can’t play inside the page (it’s a viewer page, not a video file).
        </p>
        <p className="lib-media__hint">
          Upload the video file in admin, or paste a YouTube / Google Drive link instead.
        </p>
        <a href={external} target="_blank" rel="noopener noreferrer" className="lib-media__open">
          Open on {where} →
        </a>
      </div>
    );
  }

  return (
    <div className={`lib-media lib-media--empty ${className}`.trim()} aria-hidden="true">
      <span>{item.kind === 'audio' ? 'Audio' : 'Video'} coming soon</span>
    </div>
  );
}

function Thumb({ item, label = 'EP' }) {
  const src = assetUrl(item?.thumbnail) || (item?.kind === 'video' ? libraryYoutube : null);
  if (src) {
    return <img src={src} alt="" className="lib-thumb-img" />;
  }
  return <span>{label}</span>;
}

export default function Library() {
  const [activeBrowse, setActiveBrowse] = useState(LIB_BROWSE[0].id);
  const [podcasts, setPodcasts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [featuredVideoId, setFeaturedVideoId] = useState(null);
  const [activePlayerId, setActivePlayerId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .get('/library-podcasts')
      .then((r) => {
        if (cancelled) return;
        const list = Array.isArray(r.data) ? r.data : [];
        setPodcasts(list);
        setLoadError('');
      })
      .catch(() => {
        if (!cancelled) {
          setPodcasts([]);
          setLoadError('Podcasts could not be loaded right now.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const audioTop5 = useMemo(
    () => podcasts.filter((p) => p.kind === 'audio').slice(0, 5),
    [podcasts],
  );
  const videoTop5 = useMemo(
    () => podcasts.filter((p) => p.kind === 'video').slice(0, 5),
    [podcasts],
  );

  const latest = useMemo(() => {
    if (!podcasts.length) return null;
    return podcasts[0];
  }, [podcasts]);

  const playerItem = useMemo(() => {
    if (activePlayerId) {
      return podcasts.find((p) => p.id === activePlayerId) || latest;
    }
    return latest;
  }, [activePlayerId, podcasts, latest]);

  const featuredVideo = useMemo(() => {
    if (!videoTop5.length) return null;
    if (featuredVideoId) {
      return videoTop5.find((v) => v.id === featuredVideoId) || videoTop5[0];
    }
    return videoTop5[0];
  }, [videoTop5, featuredVideoId]);

  const videoSideList = useMemo(() => {
    if (!featuredVideo) return videoTop5;
    return videoTop5.filter((v) => v.id !== featuredVideo.id);
  }, [videoTop5, featuredVideo]);

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

  const playInTop = (item) => {
    setActivePlayerId(item.id);
    document.getElementById('lib-featured-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="lib">
      <header className="lib-hero">
        <div className="container lib-hero__grid">
          <Reveal as="div" className="lib-hero__copy" variant="up">
            <p className="lib-label lib-label--on-dark">The Library</p>
            <h1>
              Knowledge.
              <br />
              Conversations.
              <br />
              <em>Ideas.</em>
            </h1>
            <p className="lib-hero__lead">
              The law does not exist only in statutes and judgments. It shapes how we work, learn, raise
              our children, exercise our rights, interact with institutions and understand the world
              around us.
            </p>
            <p className="lib-hero__lead">
              The RKLAF Library brings together the conversations, ideas and resources through which we
              explore that relationship, making legal knowledge more accessible and creating space to
              question, discuss and engage with the law.
            </p>
            <div className="lib-platforms">
              {platforms.map((p) => (
                <a key={p.label} href={p.href} className="lib-platform" target="_blank" rel="noopener noreferrer">
                  <PlatformIcon name={p.icon} />
                  {p.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal as="div" className="lib-hero__photo lib-hero__photo--img" variant="scale" delay={60}>
            <span className="lib-hero__halo" aria-hidden="true" />
            <img src={libraryBanner} alt="" />
          </Reveal>
        </div>
      </header>

      <div className="lib-player-bridge" id="lib-featured-player">
        <div className="container">
          <Reveal as="div" className={`lib-player${playerItem?.kind === 'video' ? ' lib-player--video' : ''}`} variant="up">
            {playerItem ? (
              <>
                <div className="lib-player__art" aria-hidden={!assetUrl(playerItem.thumbnail)}>
                  <Thumb item={playerItem} label={playerItem.kind === 'video' ? 'VID' : 'EP'} />
                </div>
                <div className="lib-player__body">
                  <p className="lib-player__meta">
                    {playerItem.meta || (playerItem.kind === 'video' ? 'Latest video' : 'Latest episode')}
                  </p>
                  <h2>{displayText(playerItem.title)}</h2>
                  {playerItem.description ? (
                    <p className="lib-player__desc">{renderRichText(playerItem.description)}</p>
                  ) : null}
                  <PodcastMedia item={playerItem} className="lib-player__media" />
                </div>
              </>
            ) : (
              <div className="lib-player__body lib-player__body--empty">
                <p className="lib-player__meta">Library</p>
                <h2>{loadError || 'New episodes will appear here'}</h2>
                <p className="lib-player__desc">
                  Follow us on{' '}
                  <a href={SPOTIFY_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>{' '}
                  and{' '}
                  <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>{' '}
                  meanwhile.
                </p>
              </div>
            )}
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
              <Reveal as="div" className="lib-welcome__visual" variant="left">
                <div className="lib-welcome__photo">
                  <div className="lib-blob">
                    <img
                      src={libraryPlaceholder}
                      alt="Listener at a camp, headphones on"
                    />
                  </div>
                  <div className="lib-blob-ring" aria-hidden="true" />
                  <span className="lib-dot lib-dot--a" aria-hidden="true" />
                  <span className="lib-dot lib-dot--b" aria-hidden="true" />
                </div>
              </Reveal>

              <Reveal as="div" className="lib-welcome__copy" variant="up" delay={40}>
                <p className="lib-label lib-welcome__eyebrow">Law, Beyond the Law Books.</p>
                <h2>Nyaya Tak</h2>
                <p className="lib-welcome__italic">
                  Nyaya Tak is RKLAF&apos;s podcast bringing law into conversation with the world around us.
                </p>
                <p className="lib-welcome__body">
                  Through audio and video, Nyaya Tak explores how law intersects with everyday life,
                  society and the professions and experiences that shape it. We speak with people from
                  different fields, perspectives and walks of life, asking where the law meets their
                  world.
                </p>
                <p className="lib-welcome__body">
                  At the same time, Nyaya Tak creates a space for RKLAF&apos;s interns, volunteers and
                  members to engage with the legal questions of their time, through conversations,
                  debates and the exchange of differing views on current legal developments, rights and
                  issues affecting society.
                </p>
                <p className="lib-welcome__body">
                  The conversations may take different forms, but the purpose remains the same:
                  to ask better questions, bring different perspectives together, and understand where
                  law meets life.
                </p>
                <a href="#audio" className="lib-pill">
                  Watch · Listen →
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="audio" className="lib-episodes">
          <div className="container">
            <div className="lib-episodes__head">
              <div>
                <h2>Listen</h2>
                <p className="lib-episodes__lede">
                  Conversations recorded at the office and in the field, for listening on the way to work.
                </p>
              </div>
              <a
                href={SPOTIFY_PROFILE_URL}
                className="lib-browse-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                All audio on Spotify →
              </a>
            </div>

            <div className="lib-platforms lib-platforms--light">
              {audioPlatforms.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  className="lib-platform lib-platform--light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i aria-hidden="true">{p.icon}</i>
                  {p.label}
                </a>
              ))}
            </div>

            {audioTop5.length ? (
              <div className="lib-episodes__grid">
                {audioTop5.map((ep, i) => (
                  <Reveal key={ep.id} as="article" className="lib-ep" variant="up" delay={i * 50}>
                    <button type="button" className="lib-ep__art" onClick={() => playInTop(ep)}>
                      <Thumb item={ep} />
                      <span className="lib-ep__play">▶</span>
                    </button>
                    <div className="lib-ep__body">
                      {ep.meta ? <p className="lib-ep__tag">{ep.meta}</p> : null}
                      <h3>{displayText(ep.title)}</h3>
                      {ep.description ? <p>{renderRichText(ep.description)}</p> : null}
                      <button type="button" className="lib-ep__cta" onClick={() => playInTop(ep)}>
                        Listen →
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="lib-empty">Audio episodes will appear here once published from the admin.</p>
            )}
          </div>
        </section>

        <section id="video" className="lib-video">
          <div className="container">
            <div className="lib-episodes__head">
              <div>
                <h2>Watch</h2>
                <p className="lib-episodes__lede">
                  Full episodes filmed in the studio, plus short explainers you can send to someone who needs
                  the answer today.
                </p>
              </div>
              <a
                href={YOUTUBE_CHANNEL_URL}
                className="lib-browse-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                All videos on YouTube →
              </a>
            </div>

            {featuredVideo ? (
              <div className="lib-video__grid">
                <Reveal as="article" className="lib-video__main" variant="up">
                  <div className="lib-video__frame">
                    <span className="lib-video__tag">{featuredVideo.meta || 'Latest episode'}</span>
                    <PodcastMedia item={featuredVideo} />
                  </div>
                  <div className="lib-video__body">
                    <h3>{displayText(featuredVideo.title)}</h3>
                    {featuredVideo.description ? <p>{renderRichText(featuredVideo.description)}</p> : null}
                  </div>
                </Reveal>

                <div className="lib-video__list">
                  {videoSideList.map((v, i) => (
                    <Reveal key={v.id} as="article" className="lib-video__item" variant="up" delay={i * 40}>
                      <button
                        type="button"
                        className="lib-video__thumb"
                        onClick={() => {
                          setFeaturedVideoId(v.id);
                          playInTop(v);
                        }}
                      >
                        <Thumb item={v} label="Still" />
                        <span className="lib-ep__play">▶</span>
                      </button>
                      <div>
                        {v.meta ? <p className="lib-ep__tag">{v.meta}</p> : null}
                        <h4>{displayText(v.title)}</h4>
                        <button
                          type="button"
                          className="lib-ep__cta"
                          onClick={() => {
                            setFeaturedVideoId(v.id);
                            playInTop(v);
                          }}
                        >
                          Watch →
                        </button>
                      </div>
                    </Reveal>
                  ))}
                  <a
                    className="lib-ytpill"
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ▶ Subscribe on YouTube
                  </a>
                  <a
                    className="lib-ytpill lib-ytpill--spotify"
                    href={SPOTIFY_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ♫ Follow on Spotify
                  </a>
                </div>
              </div>
            ) : (
              <p className="lib-empty">
                Video episodes will appear here once published.{' '}
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  Visit our YouTube channel →
                </a>
              </p>
            )}
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
            <h2>The Work, As It Happens.</h2>
            <p className="lib-socials__lede">
              Our social platforms are where RKLAF&apos;s work enters the everyday digital space. Follow us for
              legal awareness, updates from our work, public-interest initiatives, research, campaigns,
              programmes, opportunities, events and conversations from the Foundation.
            </p>
          </Reveal>

          <div className="lib-socials__grid">
            {socialShelves.map((s, i) => (
              <Reveal key={s.name} as="article" className="lib-social" variant="up" delay={i * 40}>
                <header className="lib-social__head">
                  <span className={`lib-social__icon lib-social__icon--${s.tone}`} aria-hidden="true">
                    {s.icon}
                  </span>
                  <h3>{s.name}</h3>
                </header>
                <div className={`lib-social__preview${s.previewImage ? ' lib-social__preview--img' : ''}`} aria-hidden="true">
                  {s.previewImage ? (
                    <img src={s.previewImage} alt="" />
                  ) : (
                    <span>{s.preview}</span>
                  )}
                </div>
                <p className="lib-social__blurb">{s.blurb}</p>
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
        <div className="container">
          <Reveal as="div" className="lib-donate__content" variant="up">
            <h2>Listen, share, support the work</h2>
            <p className="lib-donate__lede">
              Follow Nyaya Tak, share an episode, and help keep RKLAF&apos;s legal knowledge free for everyone
              who needs it.
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
