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
      const id = u.searchParams.get('v') || u.pathname.match(/\/embed\/([^/]+)/)?.[1];
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

function PhotoBox({ image, label, caption, className = '', fit = 'cover', position = 'center' }) {
  if (image) {
    return (
      <div className={`impact-phbox impact-phbox--media ${className}`.trim()}>
        <img src={image} alt={caption || label || ''} style={{ objectFit: fit, objectPosition: position }} />
        {caption ? <span className="impact-phbox__cap">{caption}</span> : null}
      </div>
    );
  }
  return (
    <div className={`impact-phbox ${className}`.trim()}>
      <span>{label}</span>
      {caption ? <small>{caption}</small> : null}
    </div>
  );
}

/** One Beyond Litigation / press mention card for Impact mosaic. */
export default function PressMentionCard({ item, delay = 0 }) {
  const layout = item.layout || 'clip';

  if (layout === 'quote') {
    return (
      <Reveal variant="up" delay={delay}>
        <blockquote className="impact-vquote">
          <p>{item.quote || item.title}</p>
          {item.quoteAttribution ? <span>{item.quoteAttribution}</span> : null}
        </blockquote>
      </Reveal>
    );
  }

  if (layout === 'image') {
    return (
      <Reveal variant="up" delay={delay}>
        <PhotoBox
          image={item.image ? assetUrl(item.image) : null}
          label="Clipping scan"
          caption={item.imageCaption || item.title}
          className="impact-phbox--tall"
        />
      </Reveal>
    );
  }

  if (layout === 'video') {
    const yt = pressEmbedUrl(item.youtubeUrl);
    const file = item.video ? assetUrl(item.video) : null;
    const thumb = item.thumbnail ? assetUrl(item.thumbnail) : null;
    return (
      <Reveal variant="up" delay={delay}>
        <article className="impact-press-media">
          <div className="impact-press-media__frame">
            {yt ? (
              <iframe
                src={yt}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : file ? (
              <video controls preload="metadata" poster={thumb || undefined} src={file}>
                <track kind="captions" />
              </video>
            ) : (
              <PhotoBox image={thumb} label="Video" caption={item.title} />
            )}
          </div>
          <div className="impact-press-media__body">
            {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
            <h3>{displayText(item.title)}</h3>
            {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
            {item.description ? <p className="impact-clip__desc">{renderRichText(item.description)}</p> : null}
          </div>
        </article>
      </Reveal>
    );
  }

  if (layout === 'pdf') {
    const pdfHref = item.pdf ? pressMentionPdfDownloadUrl(item.id) : item.url || null;
    const thumb = item.image ? assetUrl(item.image) : null;
    const body = (
      <>
        {thumb ? (
          <div className="impact-clip__media" aria-hidden="true">
            <img src={thumb} alt="" />
          </div>
        ) : null}
        <div className="impact-clip__copy">
          {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
          <h3>{displayText(item.title)}</h3>
          {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
          {item.description ? <p className="impact-clip__desc">{renderRichText(item.description)}</p> : null}
          {pdfHref ? <div className="impact-clip__read">Download PDF ↗</div> : null}
        </div>
      </>
    );
    return (
      <Reveal variant="up" delay={delay}>
        {pdfHref ? (
          <a href={pdfHref} className="impact-clip impact-clip--article impact-clip--pdf" target="_blank" rel="noreferrer">
            {body}
          </a>
        ) : (
          <article className="impact-clip impact-clip--article impact-clip--pdf">{body}</article>
        )}
      </Reveal>
    );
  }

  // clip + link (and any unknown) — show image, description, link
  const href = item.url || null;
  const img = item.image ? assetUrl(item.image) : null;
  const clipInner = (
    <>
      {img ? (
        <div className="impact-clip__media">
          <img src={img} alt={item.imageCaption || item.title || ''} />
        </div>
      ) : null}
      <div className="impact-clip__copy">
        {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
        <h3>{displayText(item.title)}</h3>
        {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
        {item.description ? <p className="impact-clip__desc">{renderRichText(item.description)}</p> : null}
        {href ? (
          <div className="impact-clip__read">
            {layout === 'link' ? 'Open article →' : 'Read the article →'}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <Reveal variant="up" delay={delay}>
      {href ? (
        <a href={href} className="impact-clip impact-clip--article" target="_blank" rel="noreferrer">
          {clipInner}
        </a>
      ) : (
        <article className="impact-clip impact-clip--article">{clipInner}</article>
      )}
    </Reveal>
  );
}
