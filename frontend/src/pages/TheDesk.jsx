import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { FALLBACK_DESK, deskStoryHref } from '../data/deskStories';
import './OurWork.css';
import './TheDesk.css';

function DeskEntry({ story, index }) {
  const num = String(story.number || index + 1).padStart(2, '0');
  const paras = (story.listingDescription || '')
    .split(/\n+/)
    .filter((p) => p.trim());
  const hero = story.heroImage ? assetUrl(story.heroImage) : null;
  const detail = story.gallery?.[0];
  const flip = index % 2 === 1;
  const storyHref = deskStoryHref(story);
  const accountLead =
    story.fullBody?.split(/\n+/)[0]?.trim() ||
    'Open the full account — photos, timeline, and the complete story from the desk.';

  return (
    <Reveal as="div" className={`work-desk__entry ${flip ? 'work-desk__entry--flip' : ''}`} variant="up">
      <div className="container work-desk__body">
        <div className="work-desk__copy">
          <div className="work-desk__lead">
            <span className="work-desk__num" aria-hidden="true">
              {num}
            </span>
            <div className="work-desk__lead-text">
              <p className="work-desk__kicker">{story.kicker || 'The Desk'}</p>
              <h3>{story.title}</h3>
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="work-desk__photos">
          <figure className="work-frame work-frame--lg">
            {hero ? (
              <img className="work-frame__img" src={hero} alt="" />
            ) : (
              <div className="work-frame__ph">
                <span>Photo · {story.title}</span>
              </div>
            )}
          </figure>
          {detail ? (
            <figure className="work-frame work-frame--sm">
              <img className="work-frame__img" src={assetUrl(detail.url)} alt={detail.caption || ''} />
            </figure>
          ) : null}
        </div>
      </div>

      <div className="container work-account__inner work-desk__account">
        <p className="work-account__label">The full account</p>
        <h2 className="work-account__title">{story.fullHeader || story.title}</h2>
        <p className="work-account__lead">{accountLead}</p>
        {storyHref ? (
          <Link to={storyHref} className="work-pill">
            Full story →
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}

export default function TheDesk() {
  const [deskStories, setDeskStories] = useState(FALLBACK_DESK);

  useEffect(() => {
    publicApi
      .get('/desk-stories')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setDeskStories(r.data);
      })
      .catch(() => {});
  }, []);

  const featured = deskStories[0];
  const bannerStyle = featured?.heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(26,21,16,0.55), rgba(26,21,16,0.78)), url(${assetUrl(featured.heroImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div className="desk-page work work--v2">
      <header className="desk-page__hero">
        <div className="container desk-page__hero-inner">
          <p className="desk-page__eyebrow">Case work · Senior Citizens & beyond</p>
          <h1>The Desk</h1>
          <p className="desk-page__lede">
            Named files, named officers, and volunteers at every hearing — the case stories behind our
            protection desks.
          </p>
          <Link to="/our-work#programmes" className="work-pill">
            See programmes &amp; initiatives →
          </Link>
        </div>
      </header>

      <section id="desk" className="work-desk">
        <div className="work-desk__banner" style={bannerStyle}>
          <div className="work-desk__banner-inner">
            <h2 className="work-desk__title">The Desk</h2>
            {!featured?.heroImage ? (
              <p className="work-desk__ph">
                Full-bleed photo · Elderly couple at the tribunal steps, cinematic wide
              </p>
            ) : null}
            <p className="work-desk__sub">
              <span aria-hidden="true">—</span>{' '}
              {featured?.kicker || 'Senior Citizens'} · Project{' '}
              {String(featured?.number || 1).padStart(2, '0')} <span aria-hidden="true">—</span>
            </p>
            <span className="work-desk__star" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>

        {deskStories.map((story, i) => (
          <DeskEntry key={story.id || story.slug || i} story={story} index={i} />
        ))}
      </section>
    </div>
  );
}
