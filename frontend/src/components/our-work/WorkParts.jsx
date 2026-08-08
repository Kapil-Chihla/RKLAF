import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import { assetUrl } from '../../lib/api';
import { deskStoryHref } from '../../data/deskStories';

export function DeskEntry({ story, index }) {
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
              <p className="work-desk__kicker">{story.kicker || 'Programmes & Initiatives'}</p>
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

export function ProgrammeBlock({ item }) {
  const isRoute = item.href?.startsWith('/') && !item.href.includes('#');
  const More = isRoute ? Link : 'a';
  const moreProps = isRoute ? { to: item.href } : { href: item.href };

  return (
    <article className={`work-prog ${item.flip ? 'work-prog--flip' : ''}`} id={`prog-${item.num}`}>
      <div className="work-prog__copy">
        <p className="work-prog__meta">{item.meta}</p>
        <h3 className="work-prog__title">{item.title}</h3>
        <p className="work-prog__desc">{item.desc}</p>
        <div className="work-prog__stats">
          {item.stats.map((s) => (
            <div key={s.label} className="work-prog__stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <More {...moreProps} className="work-prog__more">
          Learn more {isRoute ? '→' : '↓'}
        </More>
      </div>
      <div className={`work-prog__num work-prog__num--${item.stripe}`} aria-hidden="true">
        {item.num}
      </div>
    </article>
  );
}

export function WorkPageBanner({ title = 'Our Work' }) {
  return (
    <header className="work-banner">
      <div className="work-banner__ph" aria-hidden="true">
        <span>Banner photo · Legal aid camp under way, wide shot</span>
      </div>
      <div className="container work-banner__inner">
        <h1>{title}</h1>
      </div>
    </header>
  );
}
