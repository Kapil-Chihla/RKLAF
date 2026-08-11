import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../lib/api';
import { campPhotoCount, formatCampDate, getCampHero } from '../lib/campUtils';
import CampPhotoGallery from '../components/camps/CampPhotoGallery';
import { CampCard, CampMeta } from '../components/camps/CampParts';
import { renderRichText } from '../lib/richText';
import './Camps.css';

export default function CampDetail() {
  const { slug } = useParams();
  const [camp, setCamp] = useState(null);
  const [allCamps, setAllCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMissing(false);

    Promise.all([
      axios.get(`${API_BASE}/camps/${slug}`),
      axios.get(`${API_BASE}/camps`),
    ])
      .then(([campRes, listRes]) => {
        setCamp(campRes.data);
        setAllCamps(listRes.data);
      })
      .catch(() => {
        setCamp(null);
        setAllCamps([]);
        setMissing(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const related = useMemo(
    () => allCamps.filter((item) => item.id !== camp?.id).slice(0, 3),
    [allCamps, camp?.id],
  );

  if (loading) {
    return (
      <div className="camp-detail camp-detail--loading">
        <div className="container">
          <div className="camp-skeleton camp-skeleton--detail" aria-hidden="true">
            <div className="camp-skeleton__media" />
            <div className="camp-skeleton__body">
              <div className="camp-skel-line camp-skel-line--short" />
              <div className="camp-skel-line camp-skel-line--title" />
              <div className="camp-skel-line" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (missing || !camp) {
    return (
      <div className="camp-detail">
        <div className="container camp-detail__not-found">
          <p className="camp-detail__not-found-kicker">404</p>
          <h1>Camp album not found</h1>
          <p>This camp may have been removed or the link is incorrect.</p>
          <Link to="/our-work/programs#gallery" className="camp-detail__back-btn">← Back to gallery</Link>
        </div>
      </div>
    );
  }

  const hero = getCampHero(camp);
  const date = formatCampDate(camp.date || camp.createdAt);
  const photos = campPhotoCount(camp);

  return (
    <article className="camp-detail">
      <div className="camp-detail__topbar">
        <div className="container camp-detail__topbar-inner">
          <Link to="/our-work/programs#gallery" className="camp-detail__back-link">← All camps</Link>
        </div>
      </div>

      <header className="camp-detail__masthead">
        <div className="container camp-detail__masthead-grid">
          <div className="camp-detail__intro">
            <nav className="camp-detail__breadcrumb" aria-label="Breadcrumb">
              <Link to="/our-work/programs">Programs</Link>
              <span aria-hidden="true">/</span>
              <Link to="/our-work/programs#gallery">Gallery</Link>
              <span aria-hidden="true">/</span>
              <span>{camp.title}</span>
            </nav>

            <p className="camp-detail__kicker">Field album</p>

            {camp.tags?.length > 0 && (
              <div className="camp-detail__tags">
                {camp.tags.map((tag) => (
                  <span key={tag} className="camp-detail__tag">{tag}</span>
                ))}
              </div>
            )}

            <h1>{camp.title}</h1>
            <CampMeta camp={camp} />

            {camp.summary && <p className="camp-detail__deck">{camp.summary}</p>}

            <div className="camp-detail__stat-row">
              {photos > 0 && (
                <span className="camp-detail__stat-pill">
                  <strong>{photos}</strong> {photos === 1 ? 'photo' : 'photos'}
                </span>
              )}
              {date && (
                <span className="camp-detail__stat-pill">
                  <strong>{date}</strong>
                </span>
              )}
              {camp.location && (
                <span className="camp-detail__stat-pill">
                  <strong>{camp.location}</strong>
                </span>
              )}
            </div>
          </div>

          <figure className="camp-detail__cover">
            {hero ? (
              <div className="camp-detail__cover-frame">
                <img src={hero} alt={camp.title} />
                {photos > 1 && (
                  <span className="camp-detail__cover-badge">{photos} photos</span>
                )}
              </div>
            ) : (
              <div className="camp-detail__cover-frame camp-detail__cover-frame--placeholder" aria-hidden="true">
                <span>RKLAF</span>
              </div>
            )}
          </figure>
        </div>
      </header>

      {(camp.description || camp.summary) && (
        <section className="camp-detail__story" aria-labelledby="camp-story-title">
          <div className="container">
            <div className="camp-detail__story-inner">
              <p className="camp-detail__story-kicker">On the ground</p>
              <h2 id="camp-story-title">About this camp</h2>
              {camp.description ? (
                camp.description.split(/\n+/).filter(Boolean).map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'camp-detail__story-lead' : undefined}>
                    {renderRichText(paragraph.trim())}
                  </p>
                ))
              ) : (
                <p className="camp-detail__story-lead">{renderRichText(camp.summary)}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="camp-detail__gallery-band" aria-labelledby="camp-gallery-title">
        <div className="container camp-detail__gallery-wrap">
          <header className="camp-detail__gallery-head">
            <div>
              <p className="camp-detail__gallery-kicker">Photo album</p>
              <h2 id="camp-gallery-title">Camp photos</h2>
            </div>
            <p className="camp-detail__gallery-lead">Browse the full album from this outreach event.</p>
          </header>
          <CampPhotoGallery images={camp.images} title={camp.title} variant="detail" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="camp-detail__related" aria-labelledby="related-camps-title">
          <div className="container">
            <header className="camp-detail__related-head">
              <p className="camp-detail__related-kicker">More from the field</p>
              <h2 id="related-camps-title">Other camp albums</h2>
            </header>
            <div className="camps-grid camps-grid--related">
              {related.map((item, index) => (
                <CampCard key={item.id} camp={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
