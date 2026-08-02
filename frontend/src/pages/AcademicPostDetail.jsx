import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import Reveal from '../components/motion/Reveal';
import './StoryDetail.css';

export default function AcademicPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi
      .get(`/blogs/${slug}`)
      .then((r) => {
        setPost(r.data);
        setMissing(false);
      })
      .catch(() => {
        setPost(null);
        setMissing(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="story-detail">
        <div className="container story-detail__loading">Loading…</div>
      </div>
    );
  }

  if (missing || !post) {
    return (
      <div className="story-detail">
        <div className="container story-detail__empty">
          <h1>Post not found</h1>
          <Link to="/academics">← Back to Academics</Link>
        </div>
      </div>
    );
  }

  const sections = post.sections?.filter((s) => s.heading || s.body) || [];
  const paragraphs = !sections.length
    ? (post.content || '').split(/\n+/).filter((p) => p.trim())
    : [];

  return (
    <div className="story-detail">
      <header
        className="story-detail__hero"
        style={
          post.image
            ? { backgroundImage: `linear-gradient(rgba(26,21,16,0.5), rgba(26,21,16,0.72)), url(${assetUrl(post.image)})` }
            : undefined
        }
      >
        <div className="container story-detail__hero-inner">
          <p className="story-detail__tag">
            {post.kind === 'experience' ? 'Experience from the ground' : 'Blog'}
          </p>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="story-detail__kicker">{post.excerpt}</p> : null}
        </div>
      </header>

      <article className="container story-detail__body">
        {sections.length > 0
          ? sections.map((sec, i) => (
              <Reveal key={i} as="section" className="story-detail__section" variant="up">
                {sec.heading ? <h2>{sec.heading}</h2> : null}
                {sec.body
                  ?.split(/\n+/)
                  .filter(Boolean)
                  .map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
              </Reveal>
            ))
          : paragraphs.map((p, i) => <p key={i}>{p}</p>)}

        <p className="story-detail__back">
          <Link to="/academics">← Back to Academics</Link>
        </p>
      </article>
    </div>
  );
}
