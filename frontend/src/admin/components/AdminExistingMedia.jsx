import { assetUrl } from '../../lib/api';
import { cloudinaryPdfAttachmentUrl } from '../../lib/pdfDownload';
import AdminImageHint from './AdminImageHint';

/**
 * Editable list of already-uploaded gallery images or PDF documents.
 * Remove keeps items out of the next PUT payload (galleryJson / documentsJson).
 */
export default function AdminExistingMedia({
  title,
  items,
  kind = 'image',
  onRemove,
  onChangeItem,
  onCoverFile,
  coverFiles = {},
  onClearHero,
  heroUrl,
  clearHero,
  /** Hide description + cover editors — only public title */
  titleOnly = false,
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
              {onChangeItem ? (
                <label style={{ display: 'grid', gap: 4, fontSize: '0.78rem', color: '#5a6f82' }}>
                  Show after paragraph #
                  <input
                    type="number"
                    min="1"
                    placeholder="End of story"
                    value={img.afterParagraph || ''}
                    onChange={(e) =>
                      onChangeItem(img.id || img.url, {
                        afterParagraph: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </label>
              ) : null}
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
          {items.map((doc) => {
            const docId = doc.id || doc.url;
            const pendingCover = coverFiles?.[docId];
            return (
              <li key={docId} className="admin-existing-media__doc">
                <a href={cloudinaryPdfAttachmentUrl(doc.url)} target="_blank" rel="noopener noreferrer">
                  {doc.title || doc.name || 'Document.pdf'}
                </a>
                {!titleOnly ? (
                  pendingCover ? (
                    <p className="admin-existing-media__doc-cover-empty">
                      New preview selected: {pendingCover.name}
                    </p>
                  ) : doc.coverImage ? (
                    <img className="admin-existing-media__doc-cover" src={assetUrl(doc.coverImage)} alt="" />
                  ) : (
                    <p className="admin-existing-media__doc-cover-empty">No preview image yet</p>
                  )
                ) : null}
                {onChangeItem ? (
                  <>
                    <input
                      type="text"
                      placeholder="Public name (shown on website)"
                      value={doc.title || ''}
                      onChange={(e) => onChangeItem(docId, { title: e.target.value })}
                    />
                    {!titleOnly ? (
                      <textarea
                        rows={2}
                        placeholder="Short description (like KYR practical guides)"
                        value={doc.description || ''}
                        onChange={(e) => onChangeItem(docId, { description: e.target.value })}
                      />
                    ) : null}
                  </>
                ) : null}
                {!titleOnly && onCoverFile ? (
                  <label className="admin-existing-media__cover-label">
                    Preview image (card cover)
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => onCoverFile(docId, e.target.files?.[0] || null)}
                    />
                    <AdminImageHint size="600×800 px" note="3:4 portrait card cover" />
                  </label>
                ) : null}
                {!titleOnly && (doc.coverImage || pendingCover) ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => {
                      if (onCoverFile) onCoverFile(docId, null);
                      if (onChangeItem) onChangeItem(docId, { coverImage: null });
                    }}
                  >
                    Clear preview image
                  </button>
                ) : null}
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  onClick={() => onRemove(docId)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
