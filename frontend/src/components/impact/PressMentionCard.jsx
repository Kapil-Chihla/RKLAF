import Reveal from '../motion/Reveal';
import { assetUrl } from '../../lib/api';
import { pressMentionPdfDownloadUrl } from '../../lib/pdfDownload';
import { displayText } from '../../lib/displayText';
import { renderRichText } from '../../lib/richText';

/** Turn YouTube / Vimeo watch URLs into embeddable iframe srcs. */
export function pressEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const short = u.pathname.match(/\/(?:shorts|live|embed)\/([^/?]+)/)?.[1];
      const id = u.searchParams.get('v') || short;
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function cardBodyText(item) {
  if (item.description) return item.description;
  if (item.imageCaption) return item.imageCaption;
  return '';
}

function CardHeader({ item, titleTag: TitleTag = 'h3', titleClassName = '' }) {
  const title = displayText(item.title);
  return (
    <>
      {item.outlet ? <span className="impact-clip__outlet">{displayText(item.outlet)}</span> : null}
      {title ? (
        <TitleTag className={titleClassName || undefined}>{title}</TitleTag>
      ) : null}
      {item.meta ? <span className="impact-clip__meta">{displayText(item.meta)}</span> : null}
    </>
  );
}

function CardBody({ item }) {
  const body = cardBodyText(item);
  if (!body) return null;
  return <p className="impact-clip__desc">{renderRichText(body)}</p>;
}

function ClipBody({ item, img, cta }) {
  const hasBody = Boolean(cardBodyText(item));
  const copyClass = `impact-clip__copy${hasBody ? '' : ' impact-clip__copy--compact'}`;

  return (
    <>
      {img ? (
        <div className="impact-clip__media">
          <img src={img} alt={displayText(item.imageCaption || item.title, 'Press mention')} />
        </div>
      ) : null}
      <div className={copyClass}>
        <CardHeader item={item} />
        <CardBody item={item} />
        {cta ? <div className="impact-clip__read">{cta}</div> : null}
      </div>
    </>
  );
}

function ClipShell({ href, className, children, delay }) {
  return (
    <Reveal variant="up" delay={delay}>
      {href ? (
        <a href={href} className={className} target="_blank" rel="noreferrer">
          {children}
        </a>
      ) : (
        <article className={className}>{children}</article>
      )}
    </Reveal>
  );
}

/** One Beyond Litigation / press mention card for Impact mosaic. */
export default function PressMentionCard({ item, delay = 0 }) {
  const layout = item.layout || 'clip';

  if (layout === 'quote') {
    const quoteText = displayText(item.quote) || displayText(item.title);
    const title = displayText(item.title);
    const showTitle = Boolean(title && title !== quoteText);

    return (
      <Reveal variant="up" delay={delay}>
        <blockquote className="impact-vquote">
          <div className="impact-vquote__copy">
            {item.outlet ? <span className="impact-clip__outlet">{displayText(item.outlet)}</span> : null}
            {showTitle ? (
              <cite className="impact-vquote__title">{title}</cite>
            ) : null}
            {item.meta ? <span className="impact-clip__meta">{displayText(item.meta)}</span> : null}
            {quoteText ? <p className="impact-vquote__quote">{quoteText}</p> : null}
            {item.description ? (
              <p className="impact-vquote__desc">{renderRichText(item.description)}</p>
            ) : null}
            {item.quoteAttribution ? (
              <span className="impact-vquote__attr">{displayText(item.quoteAttribution)}</span>
            ) : null}
          </div>
        </blockquote>
      </Reveal>
    );
  }

  if (layout === 'image') {
    const img = item.image ? assetUrl(item.image) : null;
    const href = item.url || null;
    return (
      <ClipShell href={href} className="impact-clip impact-clip--article impact-clip--image" delay={delay}>
        <ClipBody item={item} img={img} cta={href ? 'Open link →' : null} />
      </ClipShell>
    );
  }

  if (layout === 'video') {
    const yt = pressEmbedUrl(item.youtubeUrl) || pressEmbedUrl(item.url);
    const file = item.video ? assetUrl(item.video) : null;
    const thumb = item.thumbnail ? assetUrl(item.thumbnail) : item.image ? assetUrl(item.image) : null;
    const href = item.url || item.youtubeUrl || null;
    const hasBody = Boolean(cardBodyText(item));

    return (
      <Reveal variant="up" delay={delay}>
        <article className="impact-press-media">
          <div className="impact-press-media__frame">
            {yt ? (
              <iframe
                src={yt}
                title={displayText(item.title, 'Video')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : file ? (
              <video controls preload="metadata" playsInline poster={thumb || undefined} src={file} />
            ) : thumb ? (
              <img src={thumb} alt={displayText(item.title, 'Video')} className="impact-press-media__poster" />
            ) : (
              <div className="impact-press-media__empty">Video unavailable</div>
            )}
          </div>
          <div className={`impact-press-media__body${hasBody ? '' : ' impact-press-media__body--compact'}`}>
            <CardHeader item={item} titleTag="h3" />
            <CardBody item={item} />
            {href && !yt ? (
              <div className="impact-clip__read">
                <a href={href} target="_blank" rel="noreferrer">
                  Open link →
                </a>
              </div>
            ) : null}
          </div>
        </article>
      </Reveal>
    );
  }

  if (layout === 'pdf') {
    const pdfHref = item.pdf ? pressMentionPdfDownloadUrl(item.id) : item.url || null;
    const img = item.image ? assetUrl(item.image) : null;
    return (
      <ClipShell
        href={pdfHref}
        className="impact-clip impact-clip--article impact-clip--pdf"
        delay={delay}
      >
        <ClipBody item={item} img={img} cta={pdfHref ? 'Download PDF →' : null} />
      </ClipShell>
    );
  }

  // clip + link (and any unknown)
  const href = item.url || null;
  const img = item.image ? assetUrl(item.image) : null;
  return (
    <ClipShell href={href} className="impact-clip impact-clip--article" delay={delay}>
      <ClipBody
        item={item}
        img={img}
        cta={href ? (layout === 'link' ? 'Open article →' : 'Read the article →') : null}
      />
    </ClipShell>
  );
}
