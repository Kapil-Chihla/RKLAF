import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminImageHint from '../components/AdminImageHint';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  title: '',
  smallTitle: '',
  category: '',
  description: '',
  slideCount: '',
};

export default function RightsDecksManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const load = () =>
    api.get('/rights-decks?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setBanner(null);
    setPdf(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      smallTitle: item.smallTitle || '',
      category: item.category || '',
      description: item.description || '',
      slideCount: item.slideCount != null ? String(item.slideCount) : '',
    });
    setBanner(null);
    setPdf(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('smallTitle', form.smallTitle);
    fd.append('category', form.category);
    fd.append('description', form.description);
    if (form.slideCount.trim()) fd.append('slideCount', form.slideCount.trim());
    if (banner) fd.append('banner', banner);
    if (pdf) fd.append('pdf', pdf);
    try {
      if (editingId) {
        await api.put(`/rights-decks/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
        });
        setMsg('Deck updated.');
      } else {
        await api.post('/rights-decks', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
        });
        setMsg('Deck published.');
      }
      clearForm();
      e.target.reset?.();
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
        <h2>{editingId ? 'Edit rights deck' : 'Know Your Rights — guide decks'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Horizontal carousel cards on the public KYR page. Latest decks appear first. Clicking a card
          fills the panel below with banner, titles, description, and PDF download.
          {editingId ? ' Banner and PDF are optional when editing — leave empty to keep current files.' : ''}
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
            Big title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Filing an FIR that actually gets registered"
            />
          </label>
          <label>
            Small title
            <input
              value={form.smallTitle}
              onChange={(e) => setForm({ ...form, smallTitle: e.target.value })}
              placeholder="GUIDE 02 · REPORTING A CRIME"
            />
          </label>
          <label>
            Category (card label)
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="POLICE & FIR"
            />
          </label>
          <label>
            PDF description
            <AdminRichHint />
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Zero FIR, refusals, and the free copy you must not leave without."
            />
          </label>
          <label>
            Slide count (PDF pages — used for on-page slide arrows)
            <input
              type="number"
              min="1"
              value={form.slideCount}
              onChange={(e) => setForm({ ...form, slideCount: e.target.value })}
              placeholder="5"
            />
          </label>
          <label>
            Banner photo {editingId ? '(leave empty to keep current)' : ''}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setBanner(e.target.files?.[0] || null)}
            />
            <AdminImageHint size="1920×1080 px" note="16:9 landscape — fills the KYR deck stage and cards" />
          </label>
          <label>
            PDF file {editingId ? '(optional — leave empty to keep current)' : ''}
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? 'Saving…' : editingId ? 'Save changes' : 'Publish deck'}
            </button>
            {editingId ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearForm} disabled={busy}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Decks ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Banner</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td>{d.category || d.smallTitle || '—'}</td>
                  <td>{d.banner ? 'Yes' : '—'}</td>
                  <td>{d.pdf ? 'Yes' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(d)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this deck?')) return;
                          await api.delete(`/rights-decks/${d.id}`);
                          if (editingId === d.id) clearForm();
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
