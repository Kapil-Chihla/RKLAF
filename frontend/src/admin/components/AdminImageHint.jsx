/**
 * Note under CMS image uploads: recommended pixel size for sharp UI display.
 * @param {{ size: string, note?: string }} props
 *   size — e.g. "1920×1080 px"
 *   note — optional short context (aspect / where it shows)
 */
export default function AdminImageHint({ size, note }) {
  return (
    <p className="admin-image-hint">
      Best upload size: <strong>{size}</strong>
      {note ? <span className="admin-image-hint__note"> — {note}</span> : null}
    </p>
  );
}
