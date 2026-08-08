/**
 * Programme story body: ordered paragraph + image blocks.
 * Keeps fullBody + gallery in sync for older clients.
 */

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.split('?')[0].replace(/\/$/, '');
}

/** Build blocks from legacy fullBody + gallery. */
function blocksFromLegacy(fullBody, gallery = [], heroImage = null) {
  const paragraphs = String(fullBody || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const hero = normalizeUrl(heroImage);
  const images = (gallery || []).filter((img) => img?.url && normalizeUrl(img.url) !== hero);

  const byAfter = new Map();
  for (const img of images) {
    const n = Number(img.afterParagraph);
    if (Number.isFinite(n) && n > 0 && n <= paragraphs.length) {
      const list = byAfter.get(n) || [];
      list.push(img);
      byAfter.set(n, list);
    }
    // Skip unplaced “end of story” gallery items — they often duplicate the hero banner.
  }

  const blocks = [];
  paragraphs.forEach((text, index) => {
    blocks.push({ type: 'paragraph', text });
    const after = byAfter.get(index + 1) || [];
    after.forEach((img) => {
      blocks.push({
        type: 'image',
        id: img.id,
        url: img.url,
        caption: img.caption || '',
      });
    });
  });
  return blocks;
}

/** Normalize client-sent blocks. */
function normalizeBlocks(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((b) => {
      if (!b || typeof b !== 'object') return null;
      if (b.type === 'paragraph') {
        const text = String(b.text || '').trim();
        return text ? { type: 'paragraph', text } : null;
      }
      if (b.type === 'image') {
        const url = b.url ? String(b.url) : null;
        if (!url && !b.isNew) return null;
        return {
          type: 'image',
          id: b.id || null,
          url,
          caption: String(b.caption || '').trim(),
          isNew: Boolean(b.isNew),
        };
      }
      return null;
    })
    .filter(Boolean);
}

/** Derive fullBody + gallery (with afterParagraph) from blocks. */
function legacyFromBlocks(blocks) {
  let paraCount = 0;
  const paragraphs = [];
  const gallery = [];
  let order = 0;

  for (const b of blocks || []) {
    if (b.type === 'paragraph') {
      paragraphs.push(b.text);
      paraCount += 1;
    } else if (b.type === 'image' && b.url) {
      gallery.push({
        id: b.id,
        url: b.url,
        caption: b.caption || '',
        afterParagraph: paraCount > 0 ? paraCount : null,
        order: order++,
      });
    }
  }

  return {
    fullBody: paragraphs.join('\n\n'),
    gallery,
  };
}

function storyHasBlocks(story) {
  return Array.isArray(story?.bodyBlocks) && story.bodyBlocks.length > 0;
}

/** Public/admin: resolve display blocks for a story. */
function resolveBodyBlocks(story) {
  if (storyHasBlocks(story)) {
    return story.bodyBlocks
      .map((b) => {
        if (b.type === 'paragraph') return { type: 'paragraph', text: b.text || '' };
        if (b.type === 'image' && b.url) {
          return {
            type: 'image',
            id: b.id,
            url: b.url,
            caption: b.caption || '',
          };
        }
        return null;
      })
      .filter(Boolean)
      .filter((b) => {
        if (b.type !== 'image') return true;
        return normalizeUrl(b.url) !== normalizeUrl(story.heroImage);
      });
  }
  return blocksFromLegacy(story.fullBody, story.gallery, story.heroImage);
}

module.exports = {
  normalizeUrl,
  blocksFromLegacy,
  normalizeBlocks,
  legacyFromBlocks,
  resolveBodyBlocks,
  storyHasBlocks,
};
