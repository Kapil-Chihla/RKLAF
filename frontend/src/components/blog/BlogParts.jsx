import { Link } from 'react-router-dom';
import { assetUrl } from '../../lib/api';
import { formatBlogDate } from '../../lib/formatDate';

export function getAuthorInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'RK';
}

export function BlogMeta({ blog, variant = 'default' }) {
  const date = formatBlogDate(blog.createdAt);
  const author = blog.author?.trim();

  if (!date && !author) return null;

  return (
    <p className={`blogs-meta blogs-meta--${variant}`.trim()}>
      {date && <time dateTime={blog.createdAt}>{date}</time>}
      {date && author && <span className="blogs-meta__dot" aria-hidden="true" />}
      {author && <span>{author}</span>}
    </p>
  );
}

export function BlogAuthorChip({ name, large = false }) {
  const display = name?.trim() || 'RKLAF Team';

  return (
    <span className={`blogs-author ${large ? 'blogs-author--large' : ''}`.trim()}>
      <span className="blogs-author__avatar" aria-hidden="true">
        {getAuthorInitials(display)}
      </span>
      <span className="blogs-author__name">{display}</span>
    </span>
  );
}

export function blogExcerpt(blog, limit = 160) {
  if (blog.excerpt?.trim()) return blog.excerpt.trim();
  if (!blog.content) return '';
  const plain = blog.content.replace(/\s+/g, ' ').trim();
  return plain.length > limit ? `${plain.slice(0, limit - 1)}…` : plain;
}

export function BlogCover({ blog, className = '', alt = '' }) {
  const src = assetUrl(blog.image);

  if (!src) {
    return (
      <div className={`${className} ${className}--placeholder`.trim()} aria-hidden="true">
        <span className="blogs-cover__mark">RKLAF</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

export function BlogCard({ blog, index = 0 }) {
  const excerpt = blogExcerpt(blog);
  const author = blog.author?.trim() || 'RKLAF Team';

  return (
    <Link
      to={`/blogs/${blog.slug || blog.id}`}
      className="blogs-card blogs-reveal is-visible"
      style={{ '--card-i': index }}
    >
      <div className="blogs-card__frame">
        <BlogCover blog={blog} className="blogs-card__media" />
      </div>
      <div className="blogs-card__body">
        <BlogMeta blog={blog} />
        <h2 className="blogs-card__title">{blog.title}</h2>
        {excerpt && <p className="blogs-card__excerpt">{excerpt}</p>}
        <div className="blogs-card__footer">
          <BlogAuthorChip name={author} />
          <span className="blogs-card__arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}

export function BlogSkeletonGrid() {
  return (
    <div className="blogs-skeleton-grid" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <div key={n} className="blogs-skeleton">
          <div className="blogs-skeleton__media" />
          <div className="blogs-skeleton__body">
            <div className="blogs-skel-line blogs-skel-line--short" />
            <div className="blogs-skel-line blogs-skel-line--title" />
            <div className="blogs-skel-line" />
            <div className="blogs-skel-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
