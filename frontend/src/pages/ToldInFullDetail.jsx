import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import Reveal from '../components/motion/Reveal';
import {
  toldDocumentDownloadUrl,
  toldDocumentViewUrl,
} from '../lib/pdfDownload';
import { displayText } from '../lib/displayText';
import { renderRichText, RichParagraphs } from '../lib/richText';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
import './StoryDetail.css';

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
          {story.caseLine ? <p className="story-detail__caseline">{displayText(story.caseLine)}</p> : null}
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

        <RichParagraphs value={story.fullBody} />

        {story.documents?.length > 0 ? (
          <div className="story-detail__docs">
            <h2>Documents</h2>
            <ul>
              {story.documents.map((doc) => {
                const label = doc.title || doc.name || 'Document.pdf';
                const downloadHref = toldDocumentDownloadUrl(storyKey, doc.id);
                const viewHref = toldDocumentViewUrl(storyKey, doc.id);
                return (
                  <li key={doc.id}>
                    <div className="story-detail__doc story-detail__doc--split">
                      <span className="story-detail__doc-name">{label}</span>
                      <span className="story-detail__doc-actions">
                        <button
                          type="button"
                          className="story-detail__doc-btn"
                          onClick={() =>
                            setActiveDoc({ title: label, viewUrl: viewHref, downloadUrl: downloadHref })
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
