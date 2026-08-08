import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import Reveal from '../components/motion/Reveal';
import { FALLBACK_DESK } from '../data/deskStories';
import { deskDocumentDownloadUrl, deskDocumentViewUrl } from '../lib/pdfDownload';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import './StoryDetail.css';

const DOC_TONES = ['plum', 'cream', 'ink', 'sage', 'gold', 'clay', 'olive'];

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.split('?')[0].replace(/\/$/, '');
}

function GalleryFigure({ img, title }) {
  return (
    <figure className="story-detail__shot">
      <img src={assetUrl(img.url)} alt={img.caption || title} />
      {img.caption ? <figcaption>{img.caption}</figcaption> : null}
    </figure>
  );
}

export default function DeskStoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);

  useEffect(() => {
    setLoading(true);
    publicApi
      .get(`/desk-stories/${slug}`)
      .then((r) => {
        setStory(r.data);
        setMissing(false);
      })
      .catch(() => {
        const local = FALLBACK_DESK.find((s) => s.slug === slug);
        if (local) {
          setStory(local);
          setMissing(false);
        } else {
          setStory(null);
          setMissing(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="story-detail">
        <div className="container story-detail__loading">Loading story…</div>
      </div>
    );
  }

  if (missing || !story) {
    return (
      <div className="story-detail">
        <div className="container story-detail__empty">
          <h1>Story not found</h1>
          <Link to="/our-work/programmes">← Back to Programmes &amp; Initiatives</Link>
        </div>
      </div>
    );
  }

  const num = String(story.number || 1).padStart(2, '0');
  const paragraphs = (story.fullBody || '').split(/\n+/).filter((p) => p.trim());
  const heroKey = normalizeUrl(story.heroImage);
  const gallery = (story.gallery || []).filter((img) => normalizeUrl(img.url) !== heroKey);

  const imagesAfter = (paragraphIndex1Based) =>
    gallery.filter((img) => Number(img.afterParagraph) === paragraphIndex1Based);

  const trailingImages = gallery.filter((img) => {
    const n = Number(img.afterParagraph);
    return !Number.isFinite(n) || n <= 0 || n > paragraphs.length;
  });

  const storyKey = story.id || story.slug;

  return (
    <div className="story-detail">
      <header
        className="story-detail__hero"
        style={
          story.heroImage
            ? {
                backgroundImage: `linear-gradient(rgba(26,21,16,0.55), rgba(26,21,16,0.72)), url(${assetUrl(story.heroImage)})`,
              }
            : undefined
        }
      >
        <div className="container story-detail__hero-inner">
          <p className="story-detail__kicker">Programmes &amp; Initiatives · Project {num}</p>
          <h1>{story.fullHeader || story.title}</h1>
          {story.kicker ? <p className="story-detail__tag">{story.kicker}</p> : null}
        </div>
      </header>

      <article className="container story-detail__body">
        <Reveal as="div" variant="up">
          {paragraphs.length ? (
            paragraphs.map((p, i) => (
              <div key={`p-${i}`} className="story-detail__block">
                <p>{p}</p>
                {imagesAfter(i + 1).map((img) => (
                  <GalleryFigure key={img.id || img.url} img={img} title={story.title} />
                ))}
              </div>
            ))
          ) : (
            <p>{story.listingDescription}</p>
          )}
        </Reveal>

        {trailingImages.length > 0 ? (
          <div className="story-detail__gallery">
            {trailingImages.map((img) => (
              <GalleryFigure key={img.id || img.url} img={img} title={story.title} />
            ))}
          </div>
        ) : null}

        {story.documents?.length > 0 ? (
          <div className="story-detail__docs">
            <h2>Documents</h2>
            <p className="story-detail__docs-lede">
              Open any handbook to preview, zoom, and download the PDF.
            </p>
            <div className="story-detail__doc-grid">
              {story.documents.map((doc, i) => {
                const title = doc.title || doc.name || 'Document.pdf';
                const downloadHref = deskDocumentDownloadUrl(storyKey, doc.id);
                const viewHref = deskDocumentViewUrl(storyKey, doc.id);
                const tone = DOC_TONES[i % DOC_TONES.length];
                const cover = doc.coverImage ? assetUrl(doc.coverImage) : null;
                return (
                  <article key={doc.id} className="story-doc-card">
                    <button
                      type="button"
                      className={`story-doc-card__cover story-doc-card__cover--${tone}${
                        cover ? ' story-doc-card__cover--photo' : ''
                      }`}
                      style={cover ? { backgroundImage: `url(${cover})` } : undefined}
                      onClick={() =>
                        setActiveDoc({
                          title,
                          viewUrl: viewHref,
                          downloadUrl: downloadHref,
                        })
                      }
                      aria-label={`Preview ${title}`}
                    >
                      <span className="story-doc-card__badge">PDF</span>
                      {!cover ? <strong>{doc.name?.replace(/\.pdf$/i, '') || 'Guide'}</strong> : null}
                    </button>
                    <h3 className="story-doc-card__title">
                      <button
                        type="button"
                        className="story-doc-card__title-btn"
                        onClick={() =>
                          setActiveDoc({
                            title,
                            viewUrl: viewHref,
                            downloadUrl: downloadHref,
                          })
                        }
                      >
                        {title}
                      </button>
                    </h3>
                    {doc.description ? (
                      <p className="story-doc-card__desc">{doc.description}</p>
                    ) : null}
                    <div className="story-doc-card__actions">
                      <button
                        type="button"
                        className="story-doc-card__dl"
                        onClick={() =>
                          setActiveDoc({
                            title,
                            viewUrl: viewHref,
                            downloadUrl: downloadHref,
                          })
                        }
                      >
                        Preview
                      </button>
                      <a className="story-doc-card__dl story-doc-card__dl--secondary" href={downloadHref} download>
                        Download
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        <p className="story-detail__back">
          <Link to="/our-work/programmes">← Back to Programmes &amp; Initiatives</Link>
        </p>
      </article>

      {activeDoc ? (
        <PdfPreviewModal
          title={activeDoc.title}
          viewUrl={activeDoc.viewUrl}
          downloadUrl={activeDoc.downloadUrl}
          onClose={() => setActiveDoc(null)}
        />
      ) : null}
    </div>
  );
}
