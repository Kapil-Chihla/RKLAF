import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import Reveal from '../components/motion/Reveal';
import { FALLBACK_DESK } from './OurWork';
import './StoryDetail.css';

export default function DeskStoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <Link to="/our-work#desk">← Back to The Desk</Link>
        </div>
      </div>
    );
  }

  const num = String(story.number || 1).padStart(2, '0');
  const paragraphs = (story.fullBody || '').split(/\n+/).filter((p) => p.trim());

  return (
    <div className="story-detail">
      <header
        className="story-detail__hero"
        style={
          story.heroImage
            ? { backgroundImage: `linear-gradient(rgba(26,21,16,0.55), rgba(26,21,16,0.72)), url(${assetUrl(story.heroImage)})` }
            : undefined
        }
      >
        <div className="container story-detail__hero-inner">
          <p className="story-detail__kicker">
            The Desk · Project {num}
          </p>
          <h1>{story.fullHeader || story.title}</h1>
          {story.kicker ? <p className="story-detail__tag">{story.kicker}</p> : null}
        </div>
      </header>

      <article className="container story-detail__body">
        <Reveal as="div" variant="up">
          {paragraphs.length ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{story.listingDescription}</p>
          )}
        </Reveal>

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

        <p className="story-detail__back">
          <Link to="/our-work#desk">← Back to The Desk</Link>
        </p>
      </article>
    </div>
  );
}
