/**
 * Resolve ordered paragraph/image blocks for a programme story.
 * Prefers bodyBlocks; falls back to fullBody + gallery.
 */
function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.split('?')[0].replace(/\/$/, '');
}

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
  }

  const blocks = [];
  paragraphs.forEach((text, index) => {
    blocks.push({ type: 'paragraph', text });
    (byAfter.get(index + 1) || []).forEach((img) => {
      blocks.push({
        type: 'image',
        id: img.id || img.url,
        url: img.url,
        caption: img.caption || '',
      });
    });
  });
  return blocks;
}

function mapBodyBlocks(bodyBlocks, heroImage) {
  const hero = normalizeUrl(heroImage);
  return (bodyBlocks || [])
    .map((b) => {
      if (b?.type === 'paragraph' && String(b.text || '').trim()) {
        return { type: 'paragraph', text: String(b.text).trim() };
      }
      if (b?.type === 'image' && b.url) {
        if (normalizeUrl(b.url) === hero) return null;
        return {
          type: 'image',
          id: b.id || b.url,
          url: b.url,
          caption: b.caption || '',
        };
      }
      return null;
    })
    .filter(Boolean);
}

export function resolveStoryBlocks(story) {
  if (!story) return [];

  if (Array.isArray(story.bodyBlocks) && story.bodyBlocks.length) {
    const fromBlocks = mapBodyBlocks(story.bodyBlocks, story.heroImage);
    const hasImages = fromBlocks.some((b) => b.type === 'image');
    // If blocks are text-only but gallery still has placed photos, use legacy merge
    if (!hasImages && Array.isArray(story.gallery) && story.gallery.length) {
      return blocksFromLegacy(story.fullBody, story.gallery, story.heroImage);
    }
    return fromBlocks;
  }

  return blocksFromLegacy(story.fullBody, story.gallery, story.heroImage);
}

/**
 * Group into story units: one paragraph + the photos that follow it.
 * Keeps paragraph → photos → next paragraph order intact.
 */
export function groupStoryUnits(blocks) {
  const units = [];
  let current = null;

  const flush = () => {
    if (!current) return;
    units.push(current);
    current = null;
  };

  for (const block of blocks || []) {
    if (block?.type === 'paragraph') {
      flush();
      current = { type: 'unit', text: block.text, images: [] };
      continue;
    }
    if (block?.type === 'image' && block.url) {
      if (!current) {
        current = { type: 'unit', text: '', images: [] };
      }
      current.images.push(block);
    }
  }
  flush();
  return units;
}

/** @deprecated use groupStoryUnits */
export function groupStoryBlocks(blocks) {
  return groupStoryUnits(blocks).flatMap((unit) => {
    const out = [];
    if (unit.text) out.push({ type: 'paragraph', text: unit.text });
    if (unit.images.length) out.push({ type: 'gallery', images: unit.images });
    return out;
  });
}
