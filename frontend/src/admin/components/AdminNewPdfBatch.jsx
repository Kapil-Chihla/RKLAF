import AdminImageHint from './AdminImageHint';

/**
 * Multi-PDF picker with per-file public title.
 * @param {'full'|'titleOnly'} variant — full includes description + cover; titleOnly is name only.
 */
export default function AdminNewPdfBatch({ items, onChange, variant = 'titleOnly' }) {
  const titleOnly = variant === 'titleOnly';

  const setFiles = (files) => {
    const list = Array.from(files || []);
    onChange(
      list.map((file) => ({
        file,
        title: file.name.replace(/\.pdf$/i, ''),
        description: '',
        cover: null,
      })),
    );
  };

  const patchItem = (index, patch) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-new-pdfs">
      <label>
        PDF documents — select multiple
        <input
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(e) => {
            setFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {items.length ? (
        <div className="admin-new-pdfs__list">
          <p className="admin-new-pdfs__hint">
            {titleOnly ? (
              <>
                Set a <strong>custom public name</strong> for each PDF (shown on the website instead of the
                uploaded filename).
              </>
            ) : (
              <>
                Set title, description, and preview image for <strong>each</strong> PDF below.
              </>
            )}
          </p>
          {items.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className="admin-new-pdfs__card">
              <div className="admin-new-pdfs__card-head">
                <strong>
                  PDF {index + 1} of {items.length}
                </strong>
                <span className="admin-new-pdfs__filename">File: {item.file.name}</span>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
              <label>
                Public name (shown on website)
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => patchItem(index, { title: e.target.value })}
                  placeholder="e.g. Court order — Bail granted"
                  required
                />
              </label>
              {!titleOnly ? (
                <>
                  <label>
                    Description (optional)
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => patchItem(index, { description: e.target.value })}
                      placeholder="Short line under the title"
                    />
                  </label>
                  <label>
                    Preview image (optional)
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => patchItem(index, { cover: e.target.files?.[0] || null })}
                    />
                    <AdminImageHint size="600×800 px" note="3:4 portrait card cover on the public story page" />
                    {item.cover ? (
                      <span className="admin-new-pdfs__cover-name">Selected: {item.cover.name}</span>
                    ) : null}
                  </label>
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Append new PDF batch onto FormData with per-file meta + correct cover pairing. */
export function appendNewPdfBatch(fd, items) {
  if (!items?.length) return;

  const meta = [];
  const coverIndexes = [];

  items.forEach((item, index) => {
    if (!item.file) return;
    fd.append('documents', item.file);
    meta.push({
      title: String(item.title || '').trim() || item.file.name.replace(/\.pdf$/i, ''),
      description: String(item.description || '').trim(),
    });
    if (item.cover) {
      fd.append('documentCovers', item.cover);
      coverIndexes.push(index);
    }
  });

  fd.append('documentsMeta', JSON.stringify(meta));
  if (coverIndexes.length) {
    fd.append('documentCoverIndexes', JSON.stringify(coverIndexes));
  }
}
