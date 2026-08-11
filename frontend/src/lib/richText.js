import { createElement, Fragment } from 'react';

/**
 * Safe inline markup for CMS text.
 * Supports: **bold words** or wrap a whole paragraph in **…**
 * No HTML injection — only React <strong> nodes.
 */
const BOLD_RE = /\*\*([^*]+)\*\*/g;

export function hasRichMarkup(value) {
  return typeof value === 'string' && /\*\*[^*]+\*\*/.test(value);
}

/** Plain string with ** markers stripped (excerpts, aria, meta). */
export function stripRichMarkup(value, fallback = '') {
  if (value == null) return fallback;
  const cleaned = String(value)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}

/**
 * Parse a single line/paragraph into React nodes with <strong> for **bold**.
 * @returns {import('react').ReactNode}
 */
export function renderRichText(value, fallback = '') {
  if (value == null) return fallback;
  const text = String(value);
  if (!text) return fallback;

  const parts = [];
  let last = 0;
  let match;
  const re = new RegExp(BOLD_RE.source, 'g');

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(createElement('strong', { key: `b-${match.index}` }, match[1]));
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  if (!parts.length) return text;
  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0];

  return createElement(Fragment, null, ...parts);
}

/**
 * Split on blank lines and render each chunk as a <p> with bold support.
 */
export function RichParagraphs({ value, className, leadClassName }) {
  if (!value?.trim()) return null;
  const paragraphs = String(value)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return createElement(
    Fragment,
    null,
    paragraphs.map((p, i) =>
      createElement(
        'p',
        {
          key: i,
          className: i === 0 && leadClassName ? leadClassName : className,
        },
        renderRichText(p),
      ),
    ),
  );
}
