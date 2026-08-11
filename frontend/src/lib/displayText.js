/** Collapse CMS whitespace so titles/labels don’t stretch oddly in layout. */
export function displayText(value, fallback = '') {
  if (value == null) return fallback;
  const cleaned = String(value)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}
