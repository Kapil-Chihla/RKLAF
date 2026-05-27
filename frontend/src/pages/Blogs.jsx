import { useEffect, useState } from 'react';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get(`${API}/blogs`).then((r) => setBlogs(r.data)).catch(() => setBlogs([]));
  }, []);

  return (
    <PageShell
      title="Blogs"
      subtitle="Stories, updates, and insights from our legal aid community."
    >
      {blogs.length === 0 ? (
        <p className="placeholder-text">No blog posts yet. New articles will appear here once published.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog.id} className="blog-card">
              <h3>{blog.title}</h3>
              <p>{blog.excerpt || blog.content?.slice(0, 160)}</p>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
