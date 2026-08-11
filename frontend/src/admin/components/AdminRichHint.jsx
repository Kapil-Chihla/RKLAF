/** Hint shown under CMS textareas that support **bold**. */
export default function AdminRichHint() {
  return (
    <p className="admin-rich-hint">
      Tip: wrap any word or whole paragraph in <code>**double asterisks**</code> to make it{' '}
      <strong>bold</strong> on the website. Example: <code>The **Supreme Court** ruled…</code>
    </p>
  );
}
