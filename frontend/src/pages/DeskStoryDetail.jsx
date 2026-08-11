import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { FALLBACK_DESK } from '../data/deskStories';
import { deskDocumentDownloadUrl, deskDocumentViewUrl } from '../lib/pdfDownload';
import { resolveStoryBlocks } from '../lib/storyBlocks';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import './StoryDetail.css';

const DOC_TONES = ['plum', 'cream', 'ink', 'sage', 'gold', 'clay', 'olive'];

export default function DeskStoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    setMissing(false);
    setStory(null);

    publicApi
      .get(`/desk-stories/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (cancelled) return;
        if (r.data && (r.data.slug || r.data.id || r.data.title)) {
          setStory(r.data);
          setMissing(false);
        } else {
          setStory(null);
          setMissing(true);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        const local = FALLBACK_DESK.find((s) => s.slug === slug || s.id === slug);
        if (local) {
          setStory(local);
          setMissing(false);
        } else {
          setStory(null);
          setMissing(true);
          setLoadError(err?.response?.data?.message || err?.message || '');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
          {loadError ? <p>{loadError}</p> : null}
          <Link to="/our-work/programmes">← Back to Programmes &amp; Initiatives</Link>
        </div>
      </div>
    );
  }

  const num = String(story.number || 1).padStart(2, '0');
  let blocks = [];
  try {
    blocks = resolveStoryBlocks(story);
  } catch {
    blocks = [];
  }
  const storyKey = story.id || story.slug;
  const heroUrl = story.heroImage ? assetUrl(story.heroImage) : null;
  const documents = Array.isArray(story.documents) ? story.documents.filter((d) => d && d.url) : [];

  return (
    <div className="story-detail">
      <header
        className={`story-detail__hero${!heroUrl ? ' story-detail__hero--text' : ''}`}
        style={
          heroUrl
            ? {
                backgroundImage: `linear-gradient(rgba(26,21,16,0.55), rgba(26,21,16,0.72)), url(${heroUrl})`,
              }
            : undefined
        }
      >
        <div className="container story-detail__hero-inner">
          <p className="story-detail__kicker">Programmes &amp; Initiatives · Project {num}</p>
          <h1>{displayText(story.fullHeader || story.title, 'Programme')}</h1>
          {story.kicker ? <p className="story-detail__tag">{displayText(story.kicker)}</p> : null}
        </div>
      </header>

      <article className="container story-detail__body">
        <div className="story-detail__blocks">
          {blocks.length ? (
            blocks.map((block, i) =>
              block.type === 'paragraph' ? (
                <p key={`p-${i}`}>{renderRichText(block.text)}</p>
              ) : block.type === 'image' && block.url ? (
                <figure key={block.id || `img-${i}`} className="story-detail__shot">
                  <img
                    src={assetUrl(block.url)}
                    alt={block.caption || displayText(story.title, 'Programme photo')}
                  />
                  {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                </figure>
              ) : null,
            )
          ) : story.listingDescription ? (
            String(story.listingDescription)
              .split(/\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p, i) => <p key={`list-${i}`}>{renderRichText(p)}</p>)
          ) : (
            <p>Full story coming soon.</p>
          )}
        </div>

        {documents.length > 0 ? (
          <div className="story-detail__docs">
            <h2>Documents</h2>
            <p className="story-detail__docs-lede">
              Open any handbook to preview, zoom, and download the PDF.
            </p>
            <div className="story-detail__doc-grid">
              {documents.map((doc, i) => {
                const title = doc.title || doc.name || 'Document.pdf';
                const docId = doc.id || `doc-${i}`;
                const downloadHref = deskDocumentDownloadUrl(storyKey, doc.id);
                const viewHref = deskDocumentViewUrl(storyKey, doc.id);
                const tone = DOC_TONES[i % DOC_TONES.length];
                const cover = doc.coverImage ? assetUrl(doc.coverImage) : null;
                return (
                  <article key={docId} className="story-doc-card">
                    <button
                      type="button"
                      className={`story-doc-card__cover story-doc-card__cover--${tone}${
                        cover ? ' story-doc-card__cover--photo' : ''
                      }`}
                      style={cover ? { backgroundImage: `url(${cover})` } : undefined}
                      onClick={() =>
                        setActiveDoc({ title, viewUrl: viewHref, downloadUrl: downloadHref })
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
                          setActiveDoc({ title, viewUrl: viewHref, downloadUrl: downloadHref })
                        }
                      >
                        {title}
                      </button>
                    </h3>
                    {doc.description ? (
                      <p className="story-doc-card__desc">{renderRichText(doc.description)}</p>
                    ) : null}
                    <div className="story-doc-card__actions">
                      <button
                        type="button"
                        className="story-doc-card__dl"
                        onClick={() =>
                          setActiveDoc({ title, viewUrl: viewHref, downloadUrl: downloadHref })
                        }
                      >
                        Preview
                      </button>
                      <a
                        className="story-doc-card__dl story-doc-card__dl--secondary"
                        href={downloadHref}
                        download
                      >
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
