import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, assetUrl } from '../lib/api';
import { formatBlogDate } from '../lib/formatDate';
import {
  BlogAuthorChip,
  BlogCard,
  BlogCover,
  BlogMeta,
} from '../components/blog/BlogParts';
import './Blogs.css';

function ArticleBody({ content }) {
  if (!content?.trim()) return null;

  const paragraphs = content.split(/\n+/).filter((line) => line.trim());

  return (
    <div className="blog-article__content">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index === 0 ? 'blog-article__lead-para' : undefined}>
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMissing(false);

    Promise.all([
      axios.get(`${API_BASE}/blogs/${slug}`),
      axios.get(`${API_BASE}/blogs`),
    ])
      .then(([blogRes, listRes]) => {
        setBlog(blogRes.data);
        setAllBlogs(listRes.data);
      })
      .catch(() => {
        setBlog(null);
        setAllBlogs([]);
        setMissing(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const related = useMemo(
    () => allBlogs.filter((item) => item.id !== blog?.id).slice(0, 3),
    [allBlogs, blog?.id],
  );

  if (loading) {
    return (
      <div className="blog-article blog-article--loading">
        <div className="container">
          <BlogSkeleton />
        </div>
      </div>
    );
  }

  if (missing || !blog) {
    return (
      <div className="blog-article">
        <div className="container blog-article__not-found">
          <p className="blog-article__not-found-kicker">404</p>
          <h1>Article not found</h1>
          <p>This blog post may have been removed or the link is incorrect.</p>
          <Link to="/blogs" className="blog-article__back-btn">← Back to blogs</Link>
        </div>
      </div>
    );
  }

  const imageSrc = assetUrl(blog.image);
  const excerpt = blog.excerpt?.trim();
  const author = blog.author?.trim() || 'RKLAF Team';
  const date = formatBlogDate(blog.createdAt);

  return (
    <article className="blog-article">
      <div className="blog-article__topbar">
        <div className="container blog-article__topbar-inner">
          <Link to="/blogs" className="blog-article__back-link">← All blogs</Link>
        </div>
      </div>

      <header className="blog-article__masthead">
        <div className="container blog-article__masthead-grid">
          <div className="blog-article__intro">
            <nav className="blog-article__breadcrumb" aria-label="Breadcrumb">
              <Link to="/blogs">Blogs</Link>
              <span aria-hidden="true">/</span>
              <span>Article</span>
            </nav>
            <BlogMeta blog={blog} variant="masthead" />
            <h1>{blog.title}</h1>
            {excerpt && <p className="blog-article__deck">{excerpt}</p>}
            <BlogAuthorChip name={author} large />
          </div>

          <figure className="blog-article__cover">
            {imageSrc ? (
              <BlogCover blog={blog} className="blog-article__cover-frame" alt={blog.title} />
            ) : (
              <div className="blog-article__cover-frame blog-article__cover-frame--placeholder" aria-hidden="true">
                <span>RKLAF</span>
              </div>
            )}
          </figure>
        </div>
      </header>

      <div className="container blog-article__body-wrap">
        <div className="blog-article__meta-bar">
          {date && (
            <div className="blog-article__meta-item">
              <span className="blog-article__meta-label">Published</span>
              <time dateTime={blog.createdAt}>{date}</time>
            </div>
          )}
          <div className="blog-article__meta-item">
            <span className="blog-article__meta-label">Organization</span>
            <span>Radhey Krishna Legal Aid Foundation</span>
          </div>
        </div>

        <div className="blog-article__prose">
          <ArticleBody content={blog.content} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="blog-article__related" aria-labelledby="related-blogs-title">
          <div className="container">
            <header className="blog-article__related-head">
              <p className="blog-article__related-kicker">Keep reading</p>
              <h2 id="related-blogs-title">More from our blog</h2>
            </header>
            <div className="blogs-grid blogs-grid--related">
              {related.map((item, index) => (
                <BlogCard key={item.id} blog={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function BlogSkeleton() {
  return (
    <div className="blogs-skeleton blogs-skeleton--detail" aria-hidden="true">
      <div className="blogs-skeleton__media" />
      <div className="blogs-skeleton__body">
        <div className="blogs-skel-line blogs-skel-line--short" />
        <div className="blogs-skel-line blogs-skel-line--title" />
        <div className="blogs-skel-line" />
        <div className="blogs-skel-line" />
        <div className="blogs-skel-line" />
      </div>
    </div>
  );
}
