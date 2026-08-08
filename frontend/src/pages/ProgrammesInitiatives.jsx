import { useEffect, useState } from 'react';
import WorkBrowse from '../components/our-work/WorkBrowse';
import { DeskEntry, WorkPageBanner } from '../components/our-work/WorkParts';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { FALLBACK_DESK } from '../data/deskStories';
import './OurWork.css';

export default function ProgrammesInitiatives() {
  const [deskStories, setDeskStories] = useState(FALLBACK_DESK);

  useEffect(() => {
    publicApi
      .get('/desk-stories')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setDeskStories(r.data);
      })
      .catch(() => {});
  }, []);

  const featured = deskStories[0];
  const bannerStyle = featured?.heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(26,21,16,0.55), rgba(26,21,16,0.78)), url(${assetUrl(featured.heroImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div className="work work--v2">
      <WorkPageBanner title="Programmes & Initiatives" />
      <WorkBrowse activeId="programmes" />

      <div className="container">
        <p className="work-section-label work-section-label--spot">
          <span className="work-section-label__rule" aria-hidden="true" />
          Project spotlights
        </p>
      </div>

      <section id="desk" className="work-desk">
        <div className="work-desk__banner" style={bannerStyle}>
          <div className="work-desk__banner-inner">
            <h2 className="work-desk__title">
              {featured?.fullHeader || featured?.title || 'Featured programme'}
            </h2>
            {!featured?.heroImage ? (
              <p className="work-desk__ph">
                Full-bleed photo · Elderly couple at the tribunal steps, cinematic wide
              </p>
            ) : null}
            <p className="work-desk__sub">
              <span aria-hidden="true">—</span>{' '}
              {featured?.kicker || 'Programme'} · Project{' '}
              {String(featured?.number || 1).padStart(2, '0')} <span aria-hidden="true">—</span>
            </p>
            <span className="work-desk__star" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>

        {deskStories.map((story, i) => (
          <DeskEntry key={story.id || story.slug || i} story={story} index={i} />
        ))}
      </section>
    </div>
  );
}
