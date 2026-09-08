import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import { LEGAL_PAGES } from '../data/legalPages';
import './Legal.css';

const NAV = [
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'terms', label: 'Terms & conditions' },
  { slug: 'refund', label: 'Refund and cancellation policy' },
  { slug: 'disclaimer', label: 'Disclaimer' },
];

function LegalBlocks({ blocks }) {
  return blocks.map((block, i) => {
    const key = `${block.type}-${i}`;
    if (block.type === 'h2') return <h2 key={key}>{block.text}</h2>;
    if (block.type === 'h3') return <h3 key={key}>{block.text}</h3>;
    if (block.type === 'ul') {
      return (
        <ul key={key} className="legal__list">
          {(block.items || []).map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      );
    }
    if (block.type === 'note') {
      return (
        <p key={key} className="legal__note">
          {block.text}
        </p>
      );
    }
    return <p key={key}>{block.text}</p>;
  });
}

export default function Legal() {
  const { slug } = useParams();
  const page = LEGAL_PAGES[slug];

  if (!page) return <Navigate to="/legal/privacy" replace />;

  return (
    <div className="legal">
      <div className="container legal__grid">
        <aside className="legal__nav" aria-label="Legal pages">
          <p className="legal__nav-label">Legal</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/legal/${item.slug}`}
                  className={item.slug === slug ? 'is-active' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/our-work/reports">Public ledger</Link>
            </li>
          </ul>
        </aside>

        <Reveal as="article" className="legal__body" variant="up">
          <p className="legal__eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          {page.lastUpdated ? (
            <p className="legal__updated">Last updated: {page.lastUpdated}</p>
          ) : null}
          {page.lead ? <p className="legal__lead">{page.lead}</p> : null}
          {page.blocks ? <LegalBlocks blocks={page.blocks} /> : null}
          {page.paras
            ? page.paras.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))
            : null}
        </Reveal>
      </div>
    </div>
  );
}
