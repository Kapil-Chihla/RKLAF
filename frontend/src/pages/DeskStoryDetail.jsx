import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { FALLBACK_DESK } from '../data/deskStories';
import { deskDocumentDownloadUrl, deskDocumentViewUrl } from '../lib/pdfDownload';
import { resolveStoryBlocks, groupStoryUnits } from '../lib/storyBlocks';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import './StoryDetail.css';

function PhotoGrid({ images, altFallback }) {
  const list = (images || []).filter((img) => img?.url);
  if (!list.length) return null;

  const countClass =
    list.length === 1 ? 'is-1' : list.length === 2 ? 'is-2' : 'is-3';

  return (
    <div className={`story-detail__media ${countClass}`} role="group">
      {list.map((img, j) => (
        <figure key={`${img.id || img.url}-${j}`} className="story-detail__media-item">
          <img
            src={assetUrl(img.url)}
            alt={img.caption || altFallback}
            loading="lazy"
            decoding="async"
          />
          {img.caption ? <figcaption>{img.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

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
  let units = [];
  try {
    units = groupStoryUnits(resolveStoryBlocks(story));
  } catch {
    units = [];
  }
  const storyKey = story.id || story.slug;
  const heroUrl = story.heroImage ? assetUrl(story.heroImage) : null;
  const documents = Array.isArray(story.documents) ? story.documents.filter((d) => d && d.url) : [];
  const photoAlt = displayText(story.title, 'Programme photo');

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
          {units.length ? (
            units.map((unit, i) => (
              <section key={`unit-${i}`} className="story-detail__unit">
                {unit.text ? <p>{renderRichText(unit.text)}</p> : null}
                <PhotoGrid images={unit.images} altFallback={photoAlt} />
              </section>
            ))
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
            <ul>
              {documents.map((doc, i) => {
                const title = doc.title || doc.name || 'Document.pdf';
                const docId = doc.id || `doc-${i}`;
                const downloadHref = deskDocumentDownloadUrl(storyKey, doc.id);
                const viewHref = deskDocumentViewUrl(storyKey, doc.id);
                return (
                  <li key={docId}>
                    <div className="story-detail__doc story-detail__doc--split">
                      <span className="story-detail__doc-name">{title}</span>
                      <span className="story-detail__doc-actions">
                        <button
                          type="button"
                          className="story-detail__doc-btn"
                          onClick={() =>
                            setActiveDoc({ title, viewUrl: viewHref, downloadUrl: downloadHref })
                          }
                        >
                          Preview
                        </button>
                        <a
                          className="story-detail__doc-btn story-detail__doc-btn--ghost"
                          href={downloadHref}
                          download
                        >
                          Download
                        </a>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
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
