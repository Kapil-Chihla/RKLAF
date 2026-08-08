import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import Reveal from '../components/motion/Reveal';
import { successDocumentDownloadUrl } from '../lib/pdfDownload';
import './StoryDetail.css';

export default function SuccessStoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi
      .get(`/success-stories/${slug}`)
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
          <Link to="/impact#stories">← Back to Impact</Link>
        </div>
      </div>
    );
  }

  const paragraphs = (story.fullBody || '').split(/\n+/).filter((p) => p.trim());

  return (
    <div className="story-detail">
      <header
        className="story-detail__hero"
        style={
          story.heroImage
            ? { backgroundImage: `linear-gradient(rgba(26,21,16,0.5), rgba(26,21,16,0.7)), url(${assetUrl(story.heroImage)})` }
            : undefined
        }
      >
        <div className="container story-detail__hero-inner">
          {story.tag ? <p className="story-detail__tag">{story.tag}</p> : null}
          <h1>{story.title}</h1>
          {story.caption ? <p className="story-detail__kicker">{story.caption}</p> : null}
        </div>
      </header>

      <article className="container story-detail__body">
        <Reveal as="dl" className="story-detail__par" variant="up">
          <div>
            <dt>Problem</dt>
            <dd>{story.problem}</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>{story.action}</dd>
          </div>
          <div>
            <dt>Result</dt>
            <dd>{story.result}</dd>
          </div>
        </Reveal>

        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {story.gallery?.length > 0 && (
          <div className="story-detail__gallery">
            {story.gallery.map((img) => (
              <figure key={img.id}>
                <img src={assetUrl(img.url)} alt={img.caption || story.title} />
                {img.caption ? <figcaption>{img.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        )}

        {story.documents?.length > 0 && (
          <div className="story-detail__docs">
            <h2>Documents</h2>
            <ul>
              {story.documents.map((doc) => {
                const label = doc.name || 'Document.pdf';
                const href = successDocumentDownloadUrl(story.id || story.slug, doc.id);
                return (
                  <li key={doc.id}>
                    <a
                      href={href}
                      className="story-detail__doc"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="story-detail__doc-name">{label}</span>
                      <span className="story-detail__doc-action">Download PDF ↓</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="story-detail__back">
          <Link to="/impact#stories">← Back to Impact through Litigation</Link>
        </p>
      </article>
    </div>
  );
}
