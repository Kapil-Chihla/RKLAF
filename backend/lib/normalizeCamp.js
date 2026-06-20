const slugify = require('slugify');

function normalizeCamp(doc) {
  if (!doc) return null;
  const c = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };

  let images = Array.isArray(c.images) ? [...c.images] : [];
  if (!images.length && c.image) {
    images = [{ id: 'legacy', url: c.image, caption: '', order: 0 }];
  }
  images.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const heroImage = c.heroImage || c.coverImage || images[0]?.url || c.image || null;

  return {
    ...c,
    slug: c.slug || slugify(c.title || 'camp', { lower: true, strict: true }),
    images,
    heroImage,
    coverImage: heroImage,
    summary: c.summary || '',
    tags: c.tags || [],
  };
}

module.exports = normalizeCamp;
