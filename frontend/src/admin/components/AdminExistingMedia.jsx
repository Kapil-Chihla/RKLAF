import { assetUrl } from '../../lib/api';
import { cloudinaryPdfAttachmentUrl } from '../../lib/pdfDownload';

/**
 * Editable list of already-uploaded gallery images or PDF documents.
 * Remove keeps items out of the next PUT payload (galleryJson / documentsJson).
 */
export default function AdminExistingMedia({
  title,
  items,
  kind = 'image',
  onRemove,
  onClearHero,
  heroUrl,
  clearHero,
}) {
  if (!items?.length && !(kind === 'hero' && heroUrl)) return null;

  return (
    <div className="admin-existing-media">
      <p className="admin-existing-media__title">
        <strong>{title}</strong>
        <span> — click Remove to drop from this story (saved on next Save)</span>
      </p>

      {kind === 'hero' && heroUrl && !clearHero ? (
        <div className="admin-existing-media__grid">
          <div className="admin-existing-media__card">
            <img src={assetUrl(heroUrl)} alt="" />
            <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={onClearHero}>
              Remove hero
            </button>
          </div>
        </div>
      ) : null}

      {kind === 'hero' && clearHero ? (
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#5a6f82' }}>
          Hero marked for removal — will clear on Save (or pick a new hero file).
        </p>
      ) : null}

      {kind === 'image' && items?.length ? (
        <div className="admin-existing-media__grid">
          {items.map((img) => (
            <div key={img.id || img.url} className="admin-existing-media__card">
              <img src={assetUrl(img.url)} alt={img.caption || ''} />
              {img.caption ? <span className="admin-existing-media__cap">{img.caption}</span> : null}
              <button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => onRemove(img.id || img.url)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {kind === 'document' && items?.length ? (
        <ul className="admin-existing-media__docs">
          {items.map((doc) => (
            <li key={doc.id || doc.url}>
              <a
                href={cloudinaryPdfAttachmentUrl(doc.url, doc.name || 'document.pdf')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.name || 'Document.pdf'}
              </a>
              <button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => onRemove(doc.id || doc.url)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
