import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { alsoOnRecordPdfDownloadUrl } from '../lib/pdfDownload';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import PressMentionCard from '../components/impact/PressMentionCard';
import './Impact.css';

const SECTIONS = {
  ongoing: {
    title: 'Ongoing Matters',
    eyebrow: 'Impact · Full list',
    backHash: '#litigation',
    api: '/running-now',
  },
  stories: {
    title: 'Beyond the Order · Complete Legal Record',
    eyebrow: 'Impact · Full list',
    backHash: '#stories',
    api: '/success-stories',
  },
  records: {
    title: 'Also on Record',
    eyebrow: 'Impact · Full list',
    backHash: '#litigation',
    api: '/also-on-record',
  },
  press: {
    title: 'Beyond Litigation',
    eyebrow: 'Impact · Full list',
    backHash: '#press',
    api: '/press-mentions',
  },
};

function ParRows({ rows }) {
  return (
    <div className="impact-par">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k}>
            <b>{k}</b>
            <span>{renderRichText(v)}</span>
          </div>
        ))}
    </div>
  );
}

export default function ImpactCollection() {
  const { section } = useParams();
  const meta = SECTIONS[section];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meta) return undefined;
    setLoading(true);
    publicApi
      .get(meta.api)
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    return undefined;
  }, [meta]);

  if (!meta) return <Navigate to="/impact" replace />;

  return (
    <div className="impact impact--collection">
      <header className="impact-collection__head">
        <div className="container">
          <p className="impact-collection__eyebrow">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <Link to={`/impact${meta.backHash}`} className="impact-collection__back">
            ← Back to Impact
          </Link>
        </div>
      </header>

      <section className="impact-collection__body">
        <div className="container">
          {loading ? <p className="impact-empty">Loading…</p> : null}

          {!loading && !items.length ? <p className="impact-empty">Nothing published yet.</p> : null}

          {section === 'ongoing' && items.length ? (
            <div className="impact-live-grid">
              {items.map((item, i) => (
                <Reveal key={item.id} as="article" className="impact-live" variant="up" delay={Math.min(i, 8) * 30}>
                  <span className="impact-live__status">
                    <i /> {item.status || 'In trial'}
                  </span>
                  <h3>{displayText(item.title)}</h3>
                  <ParRows
                    rows={[
                      ['Allegation', item.allegation],
                      ['Relief sought', item.reliefSought],
                      ['Stage', item.stage],
                    ]}
                  />
                </Reveal>
              ))}
            </div>
          ) : null}

          {section === 'stories' && items.length ? (
            <div className="impact-story-grid">
              {items.map((story, i) => {
                const href = story.slug ? `/impact/stories/${story.slug}` : null;
                const photo = story.heroImage ? assetUrl(story.heroImage) : null;
                const inner = (
                  <>
                    <div
                      className={`impact-phbox impact-phbox--media impact-phbox--flush impact-phbox--story${photo ? '' : ''}`}
                    >
                      {photo ? (
                        <img src={photo} alt="" style={{ objectFit: 'contain', objectPosition: 'center' }} />
                      ) : (
                        <span>Portrait</span>
                      )}
                    </div>
                    <div className="impact-sbody">
                      {story.tag ? <span className="impact-tag">{story.tag}</span> : null}
                      <h3>{displayText(story.title)}</h3>
                      {story.caseLine ? <span className="impact-caseline">{story.caseLine}</span> : null}
                      <ParRows
                        rows={[
                          ['Problem', story.problem],
                          ['Action', story.action],
                          ['Result', story.result],
                        ]}
                      />
                      {href ? <span className="impact-readmore">Read more →</span> : null}
                    </div>
                  </>
                );
                return (
                  <Reveal key={story.id || story.title} variant="up" delay={Math.min(i, 8) * 30}>
                    {href ? (
                      <Link to={href} className="impact-story">
                        {inner}
                      </Link>
                    ) : (
                      <article className="impact-story">{inner}</article>
                    )}
                  </Reveal>
                );
              })}
            </div>
          ) : null}

          {section === 'records' && items.length ? (
            <div className="impact-ledger">
              {items.map((row) => {
                const href = row.file ? alsoOnRecordPdfDownloadUrl(row.id) : null;
                const Row = href ? 'a' : 'div';
                const rowProps = href
                  ? { href, className: 'impact-lrow', target: '_blank', rel: 'noreferrer' }
                  : { className: 'impact-lrow' };
                return (
                  <Row key={row.id} {...rowProps}>
                    <span className="impact-lrow__yr">{row.year}</span>
                    <span className="impact-lrow__frm">{row.header}</span>
                    <span>{renderRichText(row.description)}</span>
                    {row.statusChip ? <span className="impact-chip">{row.statusChip}</span> : <span />}
                  </Row>
                );
              })}
            </div>
          ) : null}

          {section === 'press' && items.length ? (
            <div className="impact-press-grid">
              {items.map((item, i) => (
                <PressMentionCard key={item.id} item={item} delay={Math.min(i, 8) * 30} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
