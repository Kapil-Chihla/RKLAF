import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const emptyForm = {
  title: '',
  kicker: 'Senior Citizens',
  listingDescription: '',
  fullHeader: '',
  fullBody: '',
  number: '',
  galleryCaptions: '',
};

export default function DeskStoriesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [hero, setHero] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [editing, setEditing] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/desk-stories?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setHero(null);
    setGallery([]);
    setDocuments([]);
    setEditing(null);
  };

  const startEdit = (story) => {
    setEditing(story);
    setForm({
      title: story.title || '',
      kicker: story.kicker || 'Senior Citizens',
      listingDescription: story.listingDescription || '',
      fullHeader: story.fullHeader || '',
      fullBody: story.fullBody || '',
      number: story.number != null ? String(story.number) : '',
      galleryCaptions: '',
    });
    setHero(null);
    setGallery([]);
    setDocuments([]);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '') fd.append(k, v);
    });
    if (hero) fd.append('hero', hero);
    gallery.forEach((f) => fd.append('gallery', f));
    documents.forEach((f) => fd.append('documents', f));
    try {
      if (editing) {
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

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit desk story' : 'The Desk — case stories'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Stories appear on the Desk page. Add multiple gallery images and PDF documents.
          {editing
            ? ' New gallery images and PDFs append to existing ones.'
            : ''}
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
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
            Listing description
            <textarea
              rows={4}
              required
              value={form.listingDescription}
              onChange={(e) => setForm({ ...form, listingDescription: e.target.value })}
            />
          </label>
          <label>
            Hero photo {editing ? '(leave empty to keep current)' : ''}
            <input type="file" accept="image/*" onChange={(e) => setHero(e.target.files?.[0] || null)} />
          </label>
          <label>
            Full story header
            <input
              value={form.fullHeader}
              onChange={(e) => setForm({ ...form, fullHeader: e.target.value })}
              placeholder="Defaults to title"
            />
          </label>
          <label>
            Full account
            <textarea
              rows={8}
              value={form.fullBody}
              onChange={(e) => setForm({ ...form, fullBody: e.target.value })}
            />
          </label>
          <label>
            Story images (gallery) — select multiple
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGallery(Array.from(e.target.files || []))}
            />
            {gallery.length > 0 ? (
              <small style={{ display: 'block', marginTop: 4 }}>{gallery.length} image(s) selected</small>
            ) : null}
            {editing?.gallery?.length ? (
              <small style={{ display: 'block', marginTop: 4 }}>
                Existing gallery: {editing.gallery.length} image(s)
              </small>
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
            PDF documents — select multiple
            <input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={(e) => setDocuments(Array.from(e.target.files || []))}
            />
            {documents.length > 0 ? (
              <small style={{ display: 'block', marginTop: 4 }}>{documents.length} PDF(s) selected</small>
            ) : null}
            {editing?.documents?.length ? (
              <small style={{ display: 'block', marginTop: 4 }}>
                Existing documents: {editing.documents.length}
              </small>
            ) : null}
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editing ? 'Save changes' : 'Publish desk story'}
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
        <h2>Desk stories ({items.length})</h2>
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
