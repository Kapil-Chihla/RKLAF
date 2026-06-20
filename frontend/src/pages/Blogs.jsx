import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../lib/api';
import useReveal from '../hooks/useReveal';
import { BlogCard, BlogSkeletonGrid } from '../components/blog/BlogParts';
import heroImage from '../assets/comunityoutreach.jpeg';
import './Blogs.css';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroRef, heroVisible] = useReveal(0.08);
  const [mainRef, mainVisible] = useReveal(0.06);

  useEffect(() => {
    axios
      .get(`${API_BASE}/blogs`)
      .then((response) => setBlogs(response.data))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="blogs-page">
      <section
        ref={heroRef}
        className={`blogs-hero blogs-reveal ${heroVisible ? 'is-visible' : ''}`}
      >
        <img src={heroImage} alt="" className="blogs-hero__bg" aria-hidden="true" />
        <div className="blogs-hero__overlay" aria-hidden="true" />

        <div className="container blogs-hero__inner">
          <div className="blogs-hero__copy">
            <p className="blogs-hero__kicker">Stories from the field</p>
            <h1>
              Blogs &amp;
              <span className="blogs-hero__accent"> research</span>
            </h1>
            <p className="blogs-hero__lead">
              Legal updates, camp recaps, and voices from advocates on the ground — documenting
              the fight for equal access to justice.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={mainRef}
        className={`blogs-main blogs-reveal ${mainVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          {!loading && blogs.length > 0 && (
            <header className="blogs-main__head">
              <div>
                <p className="blogs-main__eyebrow">Latest writing</p>
                <h2>Insights from our legal aid community</h2>
              </div>
              <p className="blogs-main__note">
                Field reports, case highlights, and rights education from RKLAF advocates across India.
              </p>
            </header>
          )}

          {loading ? (
            <BlogSkeletonGrid />
          ) : blogs.length === 0 ? (
            <div className="blogs-empty">
              <p className="blogs-empty__title">No stories yet</p>
              <p className="blogs-empty__text">
                New articles will appear here once published from the admin panel.
              </p>
            </div>
          ) : (
            <div className="blogs-grid">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
