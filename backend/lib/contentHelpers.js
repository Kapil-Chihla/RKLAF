/**
 * Parse sections from JSON string or "## Heading\nbody" markdown blocks.
 */
function parseSections(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((s) => ({
        heading: String(s?.heading || '').trim(),
        body: String(s?.body || '').trim(),
      }))
      .filter((s) => s.heading || s.body);
  }
  const text = String(raw).trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parseSections(parsed);
  } catch {
    /* markdown-style */
  }
  const parts = text.split(/^##\s+/m).filter(Boolean);
  return parts.map((part) => {
    const nl = part.indexOf('\n');
    if (nl === -1) return { heading: part.trim(), body: '' };
    return {
      heading: part.slice(0, nl).trim(),
      body: part.slice(nl + 1).trim(),
    };
  });
}

/**
 * Captions for gallery uploads: JSON array or newline-separated strings.
 */
function parseCaptions(raw, count) {
  let captions = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) captions = parsed.map(String);
    } catch {
      captions = String(raw)
        .split('\n')
        .map((s) => s.trim());
    }
  }
  return Array.from({ length: count }, (_, i) => captions[i] || '');
}

module.exports = { parseSections, parseCaptions };
