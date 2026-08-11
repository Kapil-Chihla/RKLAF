import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { assetUrl } from '../../lib/api';
import AdminExistingMedia from '../components/AdminExistingMedia';
import AdminNewPdfBatch, { appendNewPdfBatch } from '../components/AdminNewPdfBatch';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  title: '',
  kicker: 'Senior Citizens',
  listingDescription: '',
  featureBlurb: '',
  fullHeader: '',
  number: '',
};

let blockKey = 0;
function nextKey(prefix) {
  blockKey += 1;
  return `${prefix}-${Date.now()}-${blockKey}`;
}

function blocksFromStory(story) {
  if (Array.isArray(story?.bodyBlocks) && story.bodyBlocks.length) {
    return story.bodyBlocks
      .map((b) => {
        if (b.type === 'paragraph' && String(b.text || '').trim()) {
          return { key: nextKey('p'), type: 'paragraph', text: String(b.text).trim() };
        }
        if (b.type === 'image' && b.url) {
          return {
            key: nextKey('i'),
            type: 'image',
            id: b.id || null,
            url: b.url,
            caption: b.caption || '',
            file: null,
            preview: assetUrl(b.url),
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  const paragraphs = String(story?.fullBody || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const hero = (story?.heroImage || '').split('?')[0].replace(/\/$/, '');
  const byAfter = new Map();
  for (const img of story?.gallery || []) {
    const key = (img.url || '').split('?')[0].replace(/\/$/, '');
    if (!key || key === hero) continue;
    const n = Number(img.afterParagraph);
    if (Number.isFinite(n) && n > 0 && n <= paragraphs.length) {
      const list = byAfter.get(n) || [];
      list.push(img);
      byAfter.set(n, list);
    }
  }

  const blocks = [];
  paragraphs.forEach((text, index) => {
    blocks.push({ key: nextKey('p'), type: 'paragraph', text });
    (byAfter.get(index + 1) || []).forEach((img) => {
      blocks.push({
        key: nextKey('i'),
        type: 'image',
        id: img.id || null,
        url: img.url,
        caption: img.caption || '',
        file: null,
        preview: assetUrl(img.url),
      });
    });
  });
  return blocks.length ? blocks : [{ key: nextKey('p'), type: 'paragraph', text: '' }];
}

export default function DeskStoriesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [hero, setHero] = useState(null);
  const [blocks, setBlocks] = useState([{ key: nextKey('p'), type: 'paragraph', text: '' }]);
  const [newPdfs, setNewPdfs] = useState([]);
  const [coverReplacements, setCoverReplacements] = useState({});
  const [editing, setEditing] = useState(null);
  const [keptDocuments, setKeptDocuments] = useState([]);
  const [clearHero, setClearHero] = useState(false);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () =>
    api
      .post('/desk-stories/renumber')
      .then((r) => setItems(r.data))
      .catch(() =>
        api.get('/desk-stories?all=true').then((r) => setItems(r.data)).catch(() => {}),
      );

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setHero(null);
    setBlocks([{ key: nextKey('p'), type: 'paragraph', text: '' }]);
    setNewPdfs([]);
    setCoverReplacements({});
    setEditing(null);
    setKeptDocuments([]);
    setClearHero(false);
  };

  const startEdit = (story) => {
    setEditing(story);
    setForm({
      title: story.title || '',
      kicker: story.kicker || 'Senior Citizens',
      listingDescription: story.listingDescription || '',
      featureBlurb: story.featureBlurb || '',
      fullHeader: story.fullHeader || '',
      number: story.number != null ? String(story.number) : '',
    });
    setHero(null);
    setBlocks(blocksFromStory(story));
    setNewPdfs([]);
    setCoverReplacements({});
    setKeptDocuments([...(story.documents || [])]);
    setClearHero(false);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const patchKeptDocument = (id, patch) => {
    setKeptDocuments((prev) =>
      prev.map((doc) => ((doc.id || doc.url) === id ? { ...doc, ...patch } : doc)),
    );
  };

  const setDocCoverFile = (docId, file) => {
    setCoverReplacements((prev) => {
      const next = { ...prev };
      if (file) next[docId] = file;
      else delete next[docId];
      return next;
    });
  };

  const updateBlock = (key, patch) => {
    setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, ...patch } : b)));
  };

  const removeBlock = (key) => {
    setBlocks((prev) => {
      const next = prev.filter((b) => b.key !== key);
      return next.length ? next : [{ key: nextKey('p'), type: 'paragraph', text: '' }];
    });
  };

  const moveBlock = (key, dir) => {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const addParagraph = () => {
    setBlocks((prev) => [...prev, { key: nextKey('p'), type: 'paragraph', text: '' }]);
  };

  const addImageAfter = (afterKey) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const preview = URL.createObjectURL(file);
      const imageBlock = {
        key: nextKey('i'),
        type: 'image',
        id: null,
        url: null,
        caption: '',
        file,
        preview,
      };
      setBlocks((prev) => {
        if (!afterKey) return [...prev, imageBlock];
        const i = prev.findIndex((b) => b.key === afterKey);
        if (i < 0) return [...prev, imageBlock];
        const copy = [...prev];
        copy.splice(i + 1, 0, imageBlock);
        return copy;
      });
    };
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    const fd = new FormData();
    ['title', 'kicker', 'listingDescription', 'featureBlurb', 'fullHeader', 'number'].forEach((k) => {
      if (form[k] !== '') fd.append(k, form[k]);
    });
    if (hero) fd.append('hero', hero);

    const payload = [];
    blocks.forEach((b) => {
      if (b.type === 'paragraph') {
        if (String(b.text || '').trim()) {
          payload.push({ type: 'paragraph', text: String(b.text).trim() });
        }
        return;
      }
      if (b.file) {
        payload.push({ type: 'image', isNew: true, caption: b.caption || '' });
        fd.append('blockImages', b.file);
      } else if (b.url) {
        payload.push({
          type: 'image',
          id: b.id,
          url: b.url,
          caption: b.caption || '',
          isNew: false,
        });
      }
    });
    fd.append('bodyBlocks', JSON.stringify(payload));

    appendNewPdfBatch(fd, newPdfs);

    const replaceEntries = Object.entries(coverReplacements).filter(([, file]) => file);
    if (replaceEntries.length) {
      fd.append('coverReplaceIds', JSON.stringify(replaceEntries.map(([id]) => id)));
      replaceEntries.forEach(([, file]) => fd.append('coverReplacements', file));
    }

    try {
      if (editing) {
        fd.append('documentsJson', JSON.stringify(keptDocuments));
        if (clearHero && !hero) fd.append('clearHero', 'true');
        await api.put(`/desk-stories/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Programme updated.');
      } else {
        await api.post('/desk-stories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Programme published.');
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit programme' : 'Programmes & Initiatives'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Write the story as a stack of paragraphs. Click <strong>Add photo under this</strong> to place
          an image right after that paragraph — no paragraph numbers needed. Hero photo is only the page
          banner (do not add the same photo again in the story).
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('missing')
                ? 'admin-alert--error'
                : 'admin-alert--success'
            }`}
          >
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Programme title (public name)
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Legal Aid Behind Bars"
            />
          </label>
          <label>
            Category / kicker
            <input value={form.kicker} onChange={(e) => setForm({ ...form, kicker: e.target.value })} />
          </label>
          <label>
            Project number (optional)
            <input
              type="number"
              min="1"
              placeholder="Auto"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </label>
          <label>
            Home feature blurb (2 short lines)
            <AdminRichHint />
            <textarea
              rows={2}
              maxLength={220}
              value={form.featureBlurb}
              onChange={(e) => setForm({ ...form, featureBlurb: e.target.value })}
            />
          </label>
          <label>
            Listing description
            <AdminRichHint />
            <textarea
              rows={4}
              required
              value={form.listingDescription}
              onChange={(e) => setForm({ ...form, listingDescription: e.target.value })}
            />
          </label>

          {editing ? (
            <AdminExistingMedia
              title="Current hero (banner only)"
              kind="hero"
              heroUrl={editing.heroImage}
              clearHero={clearHero}
              onClearHero={() => setClearHero(true)}
            />
          ) : null}

          <label>
            Hero / banner photo {editing ? '(leave empty to keep current)' : ''}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setHero(e.target.files?.[0] || null);
                if (e.target.files?.[0]) setClearHero(false);
              }}
            />
          </label>
          <label>
            Alternate public title (optional)
            <input
              value={form.fullHeader}
              onChange={(e) => setForm({ ...form, fullHeader: e.target.value })}
              placeholder="Leave blank to use the programme title"
            />
          </label>

          <div className="admin-story-blocks">
            <div className="admin-story-blocks__head">
              <strong>Full story</strong>
              <span>
                Add a paragraph, then optionally add a photo under it. Use{' '}
                <code>**bold**</code> around any word or a whole paragraph to bold it on the site.
              </span>
            </div>

            {blocks.map((block, index) => (
              <div key={block.key} className={`admin-story-block admin-story-block--${block.type}`}>
                <div className="admin-story-block__toolbar">
                  <span>
                    {block.type === 'paragraph' ? `Paragraph ${index + 1}` : 'Photo'}
                  </span>
                  <div className="admin-story-block__actions">
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => moveBlock(block.key, -1)} disabled={index === 0}>
                      ↑
                    </button>
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => moveBlock(block.key, 1)} disabled={index === blocks.length - 1}>
                      ↓
                    </button>
                    <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => removeBlock(block.key)}>
                      Remove
                    </button>
                  </div>
                </div>

                {block.type === 'paragraph' ? (
                  <>
                    <textarea
                      rows={4}
                      value={block.text}
                      onChange={(e) => updateBlock(block.key, { text: e.target.value })}
                      placeholder="Write this paragraph…"
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--secondary admin-btn--sm"
                      onClick={() => addImageAfter(block.key)}
                    >
                      + Add photo under this paragraph
                    </button>
                  </>
                ) : (
                  <>
                    {block.preview ? (
                      <img src={block.preview} alt="" className="admin-story-block__img" />
                    ) : null}
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={block.caption}
                      onChange={(e) => updateBlock(block.key, { caption: e.target.value })}
                    />
                  </>
                )}
              </div>
            ))}

            <div className="admin-story-blocks__add">
              <button type="button" className="admin-btn" onClick={addParagraph}>
                + Add paragraph
              </button>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addImageAfter(null)}>
                + Add photo at end
              </button>
            </div>
          </div>

          {editing ? (
            <AdminExistingMedia
              title="Current PDF documents"
              kind="document"
              items={keptDocuments}
              coverFiles={coverReplacements}
              onCoverFile={setDocCoverFile}
              onRemove={(id) => {
                setKeptDocuments((prev) => prev.filter((doc) => (doc.id || doc.url) !== id));
                setDocCoverFile(id, null);
              }}
              onChangeItem={patchKeptDocument}
            />
          ) : null}

          <AdminNewPdfBatch items={newPdfs} onChange={setNewPdfs} />

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? 'Saving…' : editing ? 'Save changes' : 'Publish programme'}
            </button>
            {editing ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm} disabled={busy}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Programmes &amp; Initiatives ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Kicker</th>
                <th>Media</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{String(s.number).padStart(2, '0')}</td>
                  <td>{s.title}</td>
                  <td>{s.kicker}</td>
                  <td>
                    {(s.bodyBlocks || []).filter((b) => b.type === 'image').length ||
                      s.gallery?.length ||
                      0}{' '}
                    img · {(s.documents?.length || 0)} pdf
                  </td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(s)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete?')) return;
                          await api.delete(`/desk-stories/${s.id}`);
                          if (editing?.id === s.id) resetForm();
                          load();
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
