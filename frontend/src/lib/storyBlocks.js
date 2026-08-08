/**
 * Resolve ordered paragraph/image blocks for a programme story.
 * Prefers bodyBlocks; falls back to fullBody + gallery.
 */
export function resolveStoryBlocks(story) {
  if (!story) return [];
  const hero = (story.heroImage || '').split('?')[0].replace(/\/$/, '');

  if (Array.isArray(story.bodyBlocks) && story.bodyBlocks.length) {
    return story.bodyBlocks
      .map((b) => {
        if (b.type === 'paragraph' && String(b.text || '').trim()) {
          return { type: 'paragraph', text: String(b.text).trim() };
        }
        if (b.type === 'image' && b.url) {
          const key = String(b.url).split('?')[0].replace(/\/$/, '');
          if (key && key === hero) return null;
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

  const paragraphs = String(story.fullBody || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const gallery = (story.gallery || []).filter((img) => {
    const key = (img.url || '').split('?')[0].replace(/\/$/, '');
    return key && key !== hero;
  });

  const byAfter = new Map();
  for (const img of gallery) {
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
