import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminExistingMedia from '../components/AdminExistingMedia';

const emptyForm = {
  title: '',
  kicker: 'Senior Citizens',
  listingDescription: '',
  featureBlurb: '',
  fullHeader: '',
  fullBody: '',
  number: '',
  galleryCaptions: '',
  galleryAfterParagraphs: '',
  newDocTitle: '',
  newDocDescription: '',
};

export default function DeskStoriesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [hero, setHero] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentCovers, setDocumentCovers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [keptGallery, setKeptGallery] = useState([]);
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
    setGallery([]);
    setDocuments([]);
    setDocumentCovers([]);
    setEditing(null);
    setKeptGallery([]);
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
      fullBody: story.fullBody || '',
      number: story.number != null ? String(story.number) : '',
      galleryCaptions: '',
      galleryAfterParagraphs: '',
      newDocTitle: '',
      newDocDescription: '',
    });
    setHero(null);
    setGallery([]);
    setDocuments([]);
    setDocumentCovers([]);
    setKeptGallery([...(story.gallery || [])]);
    setKeptDocuments([...(story.documents || [])]);
    setClearHero(false);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const patchKeptGallery = (id, patch) => {
    setKeptGallery((prev) =>
      prev.map((img) => ((img.id || img.url) === id ? { ...img, ...patch } : img)),
    );
  };

  const patchKeptDocument = (id, patch) => {
    setKeptDocuments((prev) =>
      prev.map((doc) => ((doc.id || doc.url) === id ? { ...doc, ...patch } : doc)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    const skipKeys = new Set(['newDocTitle', 'newDocDescription']);
    Object.entries(form).forEach(([k, v]) => {
      if (skipKeys.has(k)) return;
      if (v !== '') fd.append(k, v);
    });
    if (hero) fd.append('hero', hero);
    gallery.forEach((f) => fd.append('gallery', f));
    documents.forEach((f) => fd.append('documents', f));
    documentCovers.forEach((f) => fd.append('documentCovers', f));

    if (documents.length) {
      const meta = documents.map((file, index) => ({
        title:
          index === 0 && form.newDocTitle.trim()
            ? form.newDocTitle.trim()
            : file.name.replace(/\.pdf$/i, ''),
        description: index === 0 ? form.newDocDescription.trim() : '',
      }));
      fd.append('documentsMeta', JSON.stringify(meta));
    }

    try {
      if (editing) {
        fd.append('galleryJson', JSON.stringify(keptGallery));
        fd.append('documentsJson', JSON.stringify(keptDocuments));
        if (clearHero && !hero) fd.append('clearHero', 'true');
        await api.put(`/desk-stories/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Desk story updated.');
      } else {
        await api.post('/desk-stories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Desk story published.');
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  const paragraphHint = (form.fullBody || '')
    .split(/\n+/)
    .filter((p) => p.trim()).length;

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit story' : 'Programmes & Initiatives — case stories'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Stories appear on Our Work → Programmes &amp; Initiatives
          (<code>/our-work/programmes</code>). Gallery images can be placed after a specific body
          paragraph. Hero is the banner only — do not re-add the same photo to the gallery (it will be
          deduped).
          {editing ? ' Remove existing media below, or add more files.' : ''}
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') ? 'admin-alert--error' : 'admin-alert--success'
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
            <textarea
              rows={2}
              maxLength={220}
              placeholder="Shown on the homepage Programmes cards — keep it to two short lines."
              value={form.featureBlurb}
              onChange={(e) => setForm({ ...form, featureBlurb: e.target.value })}
            />
          </label>
          <label>
            Listing description
            <textarea
              rows={4}
              required
              value={form.listingDescription}
              onChange={(e) => setForm({ ...form, listingDescription: e.target.value })}
            />
          </label>

          {editing ? (
            <AdminExistingMedia
              title="Current hero"
              kind="hero"
              heroUrl={editing.heroImage}
              clearHero={clearHero}
              onClearHero={() => setClearHero(true)}
            />
          ) : null}

          <label>
            Hero photo {editing ? '(leave empty to keep current)' : ''}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setHero(e.target.files?.[0] || null);
                if (e.target.files?.[0]) setClearHero(false);
              }}
            />
            <small style={{ display: 'block', marginTop: 4, color: '#5a6f82' }}>
              Banner only. Do not upload the same file again under Story images.
            </small>
          </label>
          <label>
            Alternate public title (optional)
            <input
              value={form.fullHeader}
              onChange={(e) => setForm({ ...form, fullHeader: e.target.value })}
              placeholder="Leave blank to use the programme title everywhere"
            />
          </label>
          <label>
            Full account (separate paragraphs with blank lines)
            <textarea
              rows={8}
              value={form.fullBody}
              onChange={(e) => setForm({ ...form, fullBody: e.target.value })}
            />
            <small style={{ display: 'block', marginTop: 4, color: '#5a6f82' }}>
              Currently {paragraphHint} paragraph{paragraphHint === 1 ? '' : 's'}. Use “after paragraph
              #” on gallery images to place photos between them (1 = after first paragraph).
            </small>
          </label>

          {editing ? (
            <AdminExistingMedia
              title="Current gallery"
              kind="image"
              items={keptGallery}
              onRemove={(id) => setKeptGallery((prev) => prev.filter((img) => (img.id || img.url) !== id))}
              onChangeItem={patchKeptGallery}
            />
          ) : null}

          <label>
            Story images (gallery) — select multiple
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGallery(Array.from(e.target.files || []))}
            />
            {gallery.length > 0 ? (
              <small style={{ display: 'block', marginTop: 4 }}>{gallery.length} new image(s) selected</small>
            ) : null}
          </label>
          <label>
            Gallery captions (one per line, same order as new images)
            <textarea
              rows={3}
              value={form.galleryCaptions}
              onChange={(e) => setForm({ ...form, galleryCaptions: e.target.value })}
            />
          </label>
          <label>
            After paragraph # for new images (one per line, same order — blank = end of story)
            <textarea
              rows={3}
              value={form.galleryAfterParagraphs}
              onChange={(e) => setForm({ ...form, galleryAfterParagraphs: e.target.value })}
              placeholder={'2\n4\n'}
            />
          </label>

          {editing ? (
            <AdminExistingMedia
              title="Current PDF documents"
              kind="document"
              items={keptDocuments}
              onRemove={(id) => setKeptDocuments((prev) => prev.filter((doc) => (doc.id || doc.url) !== id))}
              onChangeItem={patchKeptDocument}
            />
          ) : null}

          <label>
            PDF documents — select multiple
            <input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={(e) => setDocuments(Array.from(e.target.files || []))}
            />
            {documents.length > 0 ? (
              <small style={{ display: 'block', marginTop: 4 }}>{documents.length} new PDF(s) selected</small>
            ) : null}
          </label>
          <label>
            Title for first new PDF (optional)
            <input
              value={form.newDocTitle}
              onChange={(e) => setForm({ ...form, newDocTitle: e.target.value })}
              placeholder="e.g. Handbook on Inquiry Procedure"
            />
          </label>
          <label>
            Description for first new PDF (optional)
            <textarea
              rows={2}
              value={form.newDocDescription}
              onChange={(e) => setForm({ ...form, newDocDescription: e.target.value })}
              placeholder="Short blurb shown on the public card, like KYR practical guides."
            />
          </label>
          <label>
            Cover image for first new PDF (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setDocumentCovers(file ? [file] : []);
              }}
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editing ? 'Save changes' : 'Publish story'}
            </button>
            {editing ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
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
                    {(s.gallery?.length || 0)} img · {(s.documents?.length || 0)} pdf
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
