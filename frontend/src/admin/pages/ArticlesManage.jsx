import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminImageHint from '../components/AdminImageHint';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = { title: '', summary: '', body: '', category: 'General' };

export default function ArticlesManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const loadCategories = () =>
    api.get('/guide-categories').then((r) => setCategories(r.data)).catch(() => {});

  const load = () => api.get('/articles').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setFile(null);
    setCover(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      summary: item.summary || '',
      body: item.body || '',
      category: item.category || 'General',
    });
    setFile(null);
    setCover(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = form.category.trim();
    if (!category) {
      setMsg('Category is required.');
      return;
    }
    if (!editingId && !file) {
      setMsg('PDF is required for new guides.');
      return;
    }

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('summary', form.summary);
    fd.append('body', form.body);
    fd.append('category', category);
    if (file) fd.append('file', file);
    if (cover) fd.append('cover', cover);
    try {
      if (editingId) {
        await api.put(`/articles/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Guide updated.');
      } else {
        await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Guide uploaded.');
      }
      clearForm();
      load();
      loadCategories();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editingId ? 'Edit practical guide' : 'Know Your Rights — practical guides'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Cover image + PDF + title + description. Cards appear on the public Know Your Rights page.
          {editingId ? ' PDF and cover are optional when editing — leave empty to keep current files.' : ''}
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('required')
                ? 'admin-alert--error'
                : 'admin-alert--success'
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
            Description / summary
            <AdminRichHint />
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </label>
          <label>
            Category
            <input
              list="guide-categories"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Select or type a new category"
            />
            <datalist id="guide-categories">
              {categories.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </label>
          <label>
            Extra notes (optional)
            <AdminRichHint />
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </label>
          <label>
            PDF {editingId ? '(leave empty to keep current)' : '(required)'}
            <input
              type="file"
              accept="application/pdf,.pdf"
              required={!editingId}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <label>
            Cover image {editingId ? '(leave empty to keep current)' : ''}
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
            <AdminImageHint size="720×960 px" note="3:4 portrait — KYR practical guide cards" />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editingId ? 'Save changes' : 'Upload guide'}
            </button>
            {editingId ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearForm}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Guides ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Cover</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.category || 'General'}</td>
                  <td>{a.coverImage ? 'Yes' : '—'}</td>
                  <td>{a.file ? 'Yes' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(a)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this guide?')) return;
                          await api.delete(`/articles/${a.id}`);
                          if (editingId === a.id) clearForm();
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
