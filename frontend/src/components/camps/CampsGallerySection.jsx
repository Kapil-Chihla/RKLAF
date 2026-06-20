import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../lib/api';
import { CampCard, CampSkeletonGrid } from './CampParts';
import '../../pages/Camps.css';

export default function CampsGallerySection() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/camps`)
      .then((response) => setCamps(response.data))
      .catch(() => setCamps([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" className="page-subsection camps-section">
      <header className="camps-section__head">
        <div>
          <p className="camps-section__eyebrow">On the ground</p>
          <h2 className="page-subsection__title">Our Camps &amp; Gallery</h2>
        </div>
        <p className="page-subsection__lead camps-section__lead">
          Photo albums from legal aid camps, RTI drives, student audits, community clinics, and outreach events across India.
        </p>
      </header>

      {loading ? (
        <CampSkeletonGrid />
      ) : camps.length === 0 ? (
        <div className="camps-empty">
          <p>Camp albums will appear here once published from the admin panel.</p>
        </div>
      ) : (
        <div className="camps-grid">
          {camps.map((camp, index) => (
            <CampCard key={camp.id} camp={camp} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
