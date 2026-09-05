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
          {page.lead ? <p className="legal__lead">{page.lead}</p> : null}
          {page.paras.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
