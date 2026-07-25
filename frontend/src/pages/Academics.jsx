import { useMemo, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import './Academics.css';

const CATEGORIES = [
  { id: 'blogs', label: 'Blogs', layout: 'shelf' },
  { id: 'research', label: 'Research', layout: 'pdf' },
  { id: 'experiences', label: 'Experiences from the Ground', layout: 'shelf' },
  { id: 'white-papers', label: 'White Papers', layout: 'pdf' },
];

const shelves = {
  blogs: {
    kicker: 'Blogs · Read the latest',
    featured: {
      photo: 'Featured photo · Elderly hands holding a court order copy',
      title: 'Signed away under pressure? Section 23 can undo it',
      summary:
        'How tribunals cancel coerced property transfers, what evidence matters, and the 63-day timeline of our latest restoration case.',
      href: '#',
    },
    posts: [
      {
        title: 'What your maintenance petition should actually say',
        summary: 'A plain checklist of facts, dates, and annexures that keep a tribunal from sending you back to rewrite.',
        href: '#',
      },
      {
        title: 'Zero FIR, explained without the jargon',
        summary: 'Where you can file, what “refusal” looks like on paper, and how to walk out with a free copy.',
        href: '#',
      },
      {
        title: 'When a gift deed is not really a gift',
        summary: 'Pressure, signature, and the quiet week after — the marks Section 23 cases usually leave.',
        href: '#',
      },
    ],
  },
  experiences: {
    kicker: 'Experiences · From the ground',
    featured: {
      photo: 'Featured photo · Camp under a banyan, dusk queue',
      title: 'A Saturday in the field: forty files, one tribunal date',
      summary:
        'What a mobile camp actually feels like — from the first helpline call to the volunteer who sits through every hearing.',
      href: '#',
    },
    posts: [
      {
        title: 'Kamla Devi’s order copy, and the bus home',
        summary: 'A restoration case told from the steps of the tribunal, not the statute book.',
        href: '#',
      },
      {
        title: 'Night desk notes from the NRI line',
        summary: 'Overseas callers, Indian property, and the officer who stays on until the deed is found.',
        href: '#',
      },
      {
        title: 'Three villages, one weekend camp',
        summary: 'Routing by helpline demand — how we choose where the next tent goes up.',
        href: '#',
      },
    ],
  },
};

const pdfShelves = {
  research: {
    title: 'Research & findings',
    viewAll: 'View all 9 →',
    docs: [
      {
        title: 'Access to justice: findings from 1,390 legal aid case files',
        meta: 'Research brief · 2026 · 28 pages',
        href: '#',
      },
      {
        title: 'Elder maintenance outcomes across nine districts',
        meta: 'Research brief · 2025 · 36 pages',
        href: '#',
      },
      {
        title: 'Student RTI drives and pension unlock rates',
        meta: 'Field study · 2025 · 18 pages',
        href: '#',
      },
    ],
  },
  'white-papers': {
    title: 'White papers & working documents',
    viewAll: 'View all 14 →',
    docs: [
      {
        title: 'Access to justice: findings from 1,390 legal aid case files',
        meta: 'Working paper · 2026 · 42 pages',
        href: '#',
      },
      {
        title: 'A model protocol for Section 23 cancellations',
        meta: 'White paper · 2025 · 24 pages',
        href: '#',
      },
      {
        title: 'Camp intake forms that survive a tribunal file',
        meta: 'Working document · 2025 · 11 pages',
        href: '#',
      },
    ],
  },
};

function FeaturedShelf({ category, shelf }) {
  return (
    <div className="acad-shelf">
      <Reveal as="article" className="acad-featured" variant="up">
        <div className="acad-featured__photo" aria-hidden="true">
          <span>{shelf.featured.photo}</span>
        </div>
        <div className="acad-featured__card">
          <span className="acad-featured__badge" aria-hidden="true">
            Read the latest
          </span>
          <p className="acad-featured__kicker">{shelf.kicker}</p>
          <h2>{shelf.featured.title}</h2>
          <p className="acad-featured__summary">{shelf.featured.summary}</p>
          <a href={shelf.featured.href} className="acad-btn">
            Read post
          </a>
        </div>
      </Reveal>

      <div className="acad-grid">
        {shelf.posts.map((post, i) => (
          <Reveal key={post.title} as="article" className="acad-card" variant="up" delay={i * 50}>
            <span className="acad-card__spine" aria-hidden="true">
              {category.label}
            </span>
            <div className="acad-card__photo" aria-hidden="true">
              <span>Photo</span>
            </div>
            <div className="acad-card__body">
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <a href={post.href} className="acad-card__more">
                Read more →
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function PdfShelf({ shelf }) {
  return (
    <div className="acad-pdfs">
      <Reveal as="header" className="acad-pdfs__head" variant="up">
        <h2>{shelf.title}</h2>
        <a href="#browse">{shelf.viewAll}</a>
      </Reveal>

      <div className="acad-pdfs__grid">
        {shelf.docs.map((doc, i) => (
          <Reveal key={doc.title} as="article" className="acad-pdf" variant="up" delay={i * 50}>
            <span className="acad-pdf__icon" aria-hidden="true">
              PDF
            </span>
            <div className="acad-pdf__body">
              <h3>{doc.title}</h3>
              <p>{doc.meta}</p>
              <a href={doc.href} className="acad-pdf__dl">
                Download ↓
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Academics() {
  const [active, setActive] = useState('blogs');

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0],
    [active],
  );

  return (
    <div className="acad">
      <header className="acad-banner">
        <div className="container acad-banner__inner">
          <h1>Academics</h1>
          <p className="acad-banner__cats">
            {CATEGORIES.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? <span className="acad-banner__dot" aria-hidden="true"> · </span> : null}
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
              ? 'Each category opens its own shelf: featured piece on top, latest three below.'
              : 'Research and white papers open as downloadable PDFs — title, year, and page count on each card.'}
          </p>

          {category.layout === 'shelf' ? (
            <FeaturedShelf category={category} shelf={shelves[category.id]} />
          ) : (
            <PdfShelf shelf={pdfShelves[category.id]} />
          )}
        </div>
      </section>
    </div>
  );
}
