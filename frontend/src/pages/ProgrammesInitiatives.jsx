import { useEffect, useState } from 'react';
import WorkBrowse from '../components/our-work/WorkBrowse';
import { DeskSpotlight, WorkPageBanner } from '../components/our-work/WorkParts';
import publicApi from '../lib/publicApi';
import { FALLBACK_DESK, sortDeskStoriesLatest } from '../data/deskStories';
import './OurWork.css';

export default function ProgrammesInitiatives() {
  const [deskStories, setDeskStories] = useState(FALLBACK_DESK);

  useEffect(() => {
    publicApi
      .get('/desk-stories')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setDeskStories(sortDeskStoriesLatest(r.data));
      })
      .catch(() => {});
  }, []);

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
        {deskStories.map((story, i) => (
          <DeskSpotlight key={story.id || story.slug || i} story={story} index={i} />
        ))}
      </section>
    </div>
  );
}
