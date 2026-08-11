import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import { assetUrl } from '../../lib/api';
import { displayText } from '../../lib/displayText';
import { renderRichText } from '../../lib/richText';
import { deskStoryHref } from '../../data/deskStories';
import ourWorkBanner from '../../assets/ourworkbanner.jpeg';

export function DeskEntry({ story, index }) {
  const num = String(story.number || index + 1).padStart(2, '0');
  const displayTitle = displayText(story.fullHeader || story.title);
  const paras = (story.listingDescription || '')
    .split(/\n+/)
    .filter((p) => p.trim());
  const hero = story.heroImage ? assetUrl(story.heroImage) : null;
  const flip = index % 2 === 1;
  const storyHref = deskStoryHref(story);
  // Featured programme title lives in the page banner — don't repeat it here.
  const showTitle = index > 0 && Boolean(displayTitle);

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
              {showTitle ? <h3>{displayTitle}</h3> : null}
              {paras.map((p, i) => (
                <p key={i}>{renderRichText(p)}</p>
              ))}
              {storyHref ? (
                <Link to={storyHref} className="work-pill">
                  Full story →
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="work-desk__photos">
          <figure className="work-frame work-frame--lg">
            {hero ? (
              <img className="work-frame__img" src={hero} alt="" />
            ) : (
              <div className="work-frame__ph">
                <span>Photo · {displayTitle || 'Programme'}</span>
              </div>
            )}
          </figure>
        </div>
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
        <h3 className="work-prog__title">{displayText(item.title)}</h3>
        <p className="work-prog__desc">{displayText(item.desc)}</p>
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

export function WorkPageBanner({ title = 'Our Work', image = ourWorkBanner }) {
  const bg = image
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(43, 34, 26, 0.38), rgba(43, 34, 26, 0.62)), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <header className="work-banner">
      <div className={`work-banner__ph${image ? ' work-banner__ph--photo' : ''}`} style={bg} aria-hidden="true">
        {!image ? <span>Banner photo · Legal aid camp under way, wide shot</span> : null}
      </div>
      <div className="container work-banner__inner">
        <h1>{title}</h1>
      </div>
    </header>
  );
}
