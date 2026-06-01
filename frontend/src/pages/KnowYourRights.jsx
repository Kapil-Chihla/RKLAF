import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FaqAccordion from '../components/FaqAccordion';
import { API_BASE, assetUrl } from '../lib/api';
import { faqs } from '../data/faqs';
import { emergencyContacts, guideCategories, legalGlossary } from '../data/legalResources';
import useReveal from '../hooks/useReveal';
import heroImage from '../assets/knowyourrights.png';
import './KnowYourRights.css';

const SECTION_LINKS = [
  { id: 'guides', label: 'Guides' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'faqs', label: 'FAQs' },
];

function Section({ id, className = '', children }) {
  const [ref, visible] = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`kyr-section kyr-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </section>
  );
}

function GuideSkeleton() {
  return (
    <>
      {[1, 2, 3].map((n) => (
        <div key={n} className="kyr-guide-card kyr-guide-card--skeleton" aria-hidden="true">
          <div className="kyr-skel kyr-skel--tag" />
          <div className="kyr-skel kyr-skel--title" />
          <div className="kyr-skel kyr-skel--line" />
          <div className="kyr-skel kyr-skel--line kyr-skel--short" />
        </div>
      ))}
    </>
  );
}

export default function KnowYourRights() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [heroRef, heroVisible] = useReveal(0.05);

  useEffect(() => {
    axios
      .get(`${API_BASE}/articles`)
      .then((r) => setGuides(r.data.filter((a) => a.file)))
      .catch(() => setGuides([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredGuides = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guides.filter((g) => {
      const matchCat = category === 'All' || (g.category || 'General') === category;
      const matchSearch =
        !q ||
        g.title?.toLowerCase().includes(q) ||
        g.summary?.toLowerCase().includes(q) ||
        (g.category || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [guides, search, category]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="kyr-page">
      <section className={`kyr-hero kyr-reveal ${heroVisible ? 'is-visible' : ''}`} ref={heroRef}>
        <img
          src={heroImage}
          alt=""
          className="kyr-hero__bg"
          aria-hidden="true"
        />
        <div className="kyr-hero__overlay" aria-hidden="true" />

        <div className="container kyr-hero__inner">
          <div className="kyr-hero__content">
            <p className="kyr-hero__badge">Resources &amp; information</p>
            <h1>
              Legal knowledge
              <span className="kyr-hero__accent"> at your fingertips</span>
            </h1>
            <p className="kyr-hero__lead">
              Guides, glossary, emergency contacts, and answers — everything you need to understand your
              rights and take the next step.
            </p>
          </div>
        </div>
      </section>

      <nav className="kyr-jump" aria-label="Page sections">
        <div className="container kyr-jump__inner">
          {SECTION_LINKS.map((link) => (
            <button key={link.id} type="button" className="kyr-jump__link" onClick={() => scrollTo(link.id)}>
              {link.label}
            </button>
          ))}
          <Link to="/contact#intake" className="kyr-jump__link kyr-jump__link--cta">
            Request help →
          </Link>
        </div>
      </nav>

      <div className="kyr-body">
        <div className="container">
          <Section id="guides">
            <header className="kyr-section__head">
              <p className="kyr-section__eyebrow">Download</p>
              <h2 className="kyr-section__title">Downloadable guides</h2>
              <p className="kyr-section__desc">
                Plain-language PDFs published by RKLAF — search and filter below.
              </p>
            </header>

            <div className="kyr-guides-toolbar">
              <label className="kyr-search kyr-search--guides">
                <span className="sr-only">Search PDF guides</span>
                <svg className="kyr-search__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  placeholder="Search PDF guides by title or topic…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <div className="kyr-chips kyr-chips--guides" role="tablist" aria-label="Filter guides by topic">
                {guideCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={category === cat}
                    className={`kyr-chip kyr-chip--guides ${category === cat ? 'is-active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="kyr-guides-grid">{GuideSkeleton()}</div>
            ) : filteredGuides.length === 0 ? (
              <div className="kyr-empty">
                <span className="kyr-empty__icon" aria-hidden="true">📄</span>
                <p>
                  {guides.length === 0
                    ? 'Guides will appear here once uploaded from the admin panel (Knowledge hub → PDF).'
                    : 'No guides match your search. Try another topic or clear the filter.'}
                </p>
              </div>
            ) : (
              <div className="kyr-guides-grid">
                {filteredGuides.map((guide, i) => (
                  <article
                    className="kyr-guide-card"
                    key={guide.id}
                    style={{ '--card-i': i }}
                  >
                    <div className="kyr-guide-card__shine" aria-hidden="true" />
                    <div className="kyr-guide-card__top">
                      <span className="kyr-guide-card__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                      <span className="kyr-guide-card__tag">{guide.category || 'General'}</span>
                    </div>
                    <h3>{guide.title}</h3>
                    <p>{guide.summary || 'Download this guide for plain-language legal information.'}</p>
                    <div className="kyr-guide-card__foot">
                      <span className="kyr-guide-card__meta">PDF guide</span>
                      <a
                        href={assetUrl(guide.file)}
                        className="btn btn-primary kyr-guide-card__dl"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Download</span>
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M10 3v10M6 9l4 4 4-4M4 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Section>

          <Section id="glossary" className="kyr-section--alt">
            <header className="kyr-section__head">
              <p className="kyr-section__eyebrow">Learn</p>
              <h2 className="kyr-section__title">Legal glossary</h2>
              <p className="kyr-section__desc">Key terms explained in everyday language.</p>
            </header>

            <div className="kyr-glossary">
              {legalGlossary.map((item, i) => (
                <article className="kyr-glossary__item" key={item.term} style={{ '--g-i': i }}>
                  <h3>{item.term}</h3>
                  <p>{item.definition}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section id="emergency">
            <header className="kyr-section__head">
              <p className="kyr-section__eyebrow">Urgent</p>
              <h2 className="kyr-section__title">Emergency contacts</h2>
              <p className="kyr-section__desc">National helplines available around the clock.</p>
            </header>

            <div className="kyr-emergency">
              <div className="kyr-emergency__head">
                <span className="kyr-emergency__alert" aria-hidden="true">!</span>
                <h3>Need immediate help?</h3>
              </div>
              <div className="kyr-emergency__grid">
                {emergencyContacts.map((c, i) => (
                  <article className="kyr-emergency__card" key={c.title} style={{ '--e-i': i }}>
                    <span className="kyr-emergency__phone-icon" aria-hidden="true" />
                    <h4>{c.title}</h4>
                    <p className="kyr-emergency__number">
                      {c.href ? (
                        <a href={c.href}>{c.number}</a>
                      ) : (
                        <a href={`tel:${c.number.replace(/\s/g, '')}`}>{c.number}</a>
                      )}
                    </p>
                    <span className="kyr-emergency__hours">{c.availability}</span>
                  </article>
                ))}
              </div>
            </div>
          </Section>

          <Section id="faqs" className="kyr-section--alt">
            <header className="kyr-section__head">
              <p className="kyr-section__eyebrow">Answers</p>
              <h2 className="kyr-section__title">Frequently asked questions</h2>
              <p className="kyr-section__desc">Tap a question to expand the answer.</p>
            </header>
            <FaqAccordion items={faqs} className="faq-accordion--kyr" defaultOpen={null} />
          </Section>

          <section className="kyr-cta kyr-reveal is-visible">
            <div className="kyr-cta__glow" aria-hidden="true" />
            <span className="kyr-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <h2>Can&apos;t find what you&apos;re looking for?</h2>
            <p>Start with our intake process on the contact page — we&apos;ll guide you from there.</p>
            <div className="kyr-cta__actions">
              <Link to="/contact#intake" className="btn btn-primary">
                View intake procedure
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
