import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import Reveal from '../components/motion/Reveal';
import {
  toldDocumentDownloadUrl,
  toldDocumentViewUrl,
} from '../lib/pdfDownload';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import './StoryDetail.css';

const DOC_TONES = ['plum', 'cream', 'ink', 'sage', 'gold', 'clay', 'olive'];

export default function ToldInFullDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);

  useEffect(() => {
    setLoading(true);
    publicApi
      .get(`/told-in-full/${slug}`)
      .then((r) => {
        setStory(r.data);
        setMissing(false);
      })
      .catch(() => {
        setStory(null);
        setMissing(true);
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
          <Link to="/impact#told">← Back to Impact</Link>
        </div>
      </div>
    );
  }

  const storyKey = story.id || story.slug;

  return (
    <div className="story-detail">
      <header className="story-detail__hero story-detail__hero--text">
        <div className="container story-detail__hero-inner">
          <p className="story-detail__kicker">Told in full · Impact</p>
          {story.tag ? <p className="story-detail__tag">{displayText(story.tag)}</p> : null}
          <h1>{displayText(story.title)}</h1>
          {story.caption ? <p className="story-detail__kicker">{displayText(story.caption)}</p> : null}
        </div>
      </header>

      <article className="container story-detail__body">
        <Reveal as="dl" className="story-detail__par" variant="up">
          <div>
            <dt>Problem</dt>
            <dd>{renderRichText(story.problem)}</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>{renderRichText(story.action)}</dd>
          </div>
          <div>
            <dt>Result</dt>
            <dd>{renderRichText(story.result)}</dd>
          </div>
        </Reveal>

        {story.documents?.length > 0 ? (
          <div className="story-detail__docs">
            <h2>Documents</h2>
            <p className="story-detail__docs-lede">
              Open any document to preview, zoom, and download the PDF.
            </p>
            <div className="story-detail__doc-grid">
              {story.documents.map((doc, i) => {
                const title = doc.title || doc.name || 'Document.pdf';
                const downloadHref = toldDocumentDownloadUrl(storyKey, doc.id);
                const viewHref = toldDocumentViewUrl(storyKey, doc.id);
                const tone = DOC_TONES[i % DOC_TONES.length];
                return (
                  <article key={doc.id} className="story-doc-card">
                    <button
                      type="button"
                      className={`story-doc-card__cover story-doc-card__cover--${tone}`}
                      onClick={() =>
                        setActiveDoc({ title, viewUrl: viewHref, downloadUrl: downloadHref })
                      }
                      aria-label={`Preview ${title}`}
                    >
                      <span className="story-doc-card__badge">PDF</span>
                      <strong>{doc.name?.replace(/\.pdf$/i, '') || 'Document'}</strong>
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
          <Link to="/impact#told">← Back to Impact — Told in full</Link>
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
