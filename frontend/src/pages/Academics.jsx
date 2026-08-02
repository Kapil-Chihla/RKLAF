import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import './Academics.css';

const CATEGORIES = [
  { id: 'blogs', label: 'Blogs', layout: 'shelf', kind: 'blog' },
  { id: 'research', label: 'Research', layout: 'pdf', paperKind: 'research' },
  { id: 'experiences', label: 'Experiences from the Ground', layout: 'shelf', kind: 'experience' },
  { id: 'white-papers', label: 'White Papers', layout: 'pdf', paperKind: 'white-paper' },
];

function FeaturedShelf({ category, posts }) {
  const [featured, ...rest] = posts;
  if (!featured) {
    return (
      <p className="acad-browse__hint" style={{ marginTop: '1.5rem' }}>
        No {category.label.toLowerCase()} published yet. Check back soon — or upload from the admin panel.
      </p>
    );
  }

  const featuredHref = `/academics/post/${featured.slug}`;
  const featuredImg = featured.image ? assetUrl(featured.image) : null;

  return (
    <div className="acad-shelf">
      <Reveal as="article" className="acad-featured" variant="up">
        <div
          className="acad-featured__photo"
          style={
            featuredImg
              ? { backgroundImage: `url(${featuredImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
          aria-hidden="true"
        >
          {!featuredImg ? <span>Featured photo</span> : null}
        </div>
        <div className="acad-featured__card">
          <span className="acad-featured__badge" aria-hidden="true">
            Read the latest
          </span>
          <p className="acad-featured__kicker">
            {category.id === 'experiences' ? 'Experiences · From the ground' : 'Blogs · Read the latest'}
          </p>
          <h2>{featured.title}</h2>
          <p className="acad-featured__summary">{featured.excerpt || ''}</p>
          <Link to={featuredHref} className="acad-btn">
            Read post
          </Link>
        </div>
      </Reveal>

      <div className="acad-grid">
        {rest.map((post, i) => (
          <Reveal key={post.id || post.slug} as="article" className="acad-card" variant="up" delay={i * 50}>
            <span className="acad-card__spine" aria-hidden="true">
              {category.label}
            </span>
            <div
              className="acad-card__photo"
              style={
                post.image
                  ? {
                      backgroundImage: `url(${assetUrl(post.image)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
              aria-hidden="true"
            >
              {!post.image ? <span>Photo</span> : null}
            </div>
            <div className="acad-card__body">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/academics/post/${post.slug}`} className="acad-card__more">
                Read more →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function PdfShelf({ title, docs }) {
  return (
    <div className="acad-pdfs">
      <Reveal as="header" className="acad-pdfs__head" variant="up">
        <h2>{title}</h2>
        <span>View all {docs.length} →</span>
      </Reveal>

      {!docs.length ? (
        <p className="acad-browse__hint">No documents uploaded yet.</p>
      ) : (
        <div className="acad-pdfs__grid">
          {docs.map((doc, i) => (
            <Reveal key={doc.id || doc.title} as="article" className="acad-pdf" variant="up" delay={i * 50}>
              <span className="acad-pdf__icon" aria-hidden="true">
                PDF
              </span>
              <div className="acad-pdf__body">
                <h3>{doc.title}</h3>
                <p>{doc.meta || 'PDF document'}</p>
                {doc.file ? (
                  <a
                    href={assetUrl(doc.file)}
                    className="acad-pdf__dl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download ↓
                  </a>
                ) : (
                  <span className="acad-pdf__dl">Coming soon</span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Academics() {
  const [active, setActive] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [research, setResearch] = useState([]);
  const [whitePapers, setWhitePapers] = useState([]);

  useEffect(() => {
    publicApi
      .get('/blogs?kind=blog')
      .then((r) => setBlogs(r.data || []))
      .catch(() => {});
    publicApi
      .get('/blogs?kind=experience')
      .then((r) => setExperiences(r.data || []))
      .catch(() => {});
    publicApi
      .get('/papers?kind=research')
      .then((r) => setResearch(r.data || []))
      .catch(() => {});
    publicApi
      .get('/papers?kind=white-paper')
      .then((r) => setWhitePapers(r.data || []))
      .catch(() => {});
  }, []);

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0],
    [active],
  );

  const shelfPosts =
    category.id === 'experiences' ? experiences : category.id === 'blogs' ? blogs : [];
  const pdfDocs =
    category.id === 'research' ? research : category.id === 'white-papers' ? whitePapers : [];
  const pdfTitle =
    category.id === 'research' ? 'Research & findings' : 'White papers & working documents';

  return (
    <div className="acad">
      <header className="acad-banner">
        <div className="container acad-banner__inner">
          <h1>Academics</h1>
          <p className="acad-banner__cats">
            {CATEGORIES.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? (
                  <span className="acad-banner__dot" aria-hidden="true">
                    {' '}
                    ·{' '}
                  </span>
                ) : null}
                <button
                  type="button"
                  className={active === c.id ? 'is-active' : ''}
                  onClick={() => setActive(c.id)}
                >
                  {c.label}
                </button>
              </span>
            ))}
          </p>
        </div>
      </header>

      <section id="browse" className="acad-browse">
        <div className="container">
          <div className="acad-browse__row">
            <span className="acad-browse__label">Browse :</span>
            <nav className="acad-browse__nav" aria-label="Academics categories">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={active === c.id ? 'is-active' : ''}
                  onClick={() => setActive(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </nav>
          </div>
          <p className="acad-browse__hint">
            {category.layout === 'shelf'
              ? 'Latest post featured on top; older pieces fill the shelf below.'
              : 'Research and white papers open as downloadable PDFs.'}
          </p>

          {category.layout === 'shelf' ? (
            <FeaturedShelf category={category} posts={shelfPosts} />
          ) : (
            <PdfShelf title={pdfTitle} docs={pdfDocs} />
          )}
        </div>
      </section>
    </div>
  );
}
