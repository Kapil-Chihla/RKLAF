import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function ArticlesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', summary: '', body: '', category: 'General' });
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const loadCategories = () =>
    api.get('/guide-categories').then((r) => setCategories(r.data)).catch(() => {});

  const load = () => api.get('/articles').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = form.category.trim();
    if (!category) {
      setMsg('Category is required.');
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
      await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Guide uploaded.');
      setForm({ title: '', summary: '', body: '', category: 'General' });
      setFile(null);
      setCover(null);
      load();
      loadCategories();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Know Your Rights — practical guides</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Cover image + PDF + title + description. Cards appear on the public Know Your Rights page.
        </p>
        {msg && <div className="admin-alert admin-alert--success">{msg}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Description / summary
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
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </label>
          <label>
            Cover image
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </label>
          <label>
            PDF
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">
            Upload guide
          </button>
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
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.category || 'General'}</td>
                  <td>{a.coverImage ? 'Yes' : '—'}</td>
                  <td>{a.file ? 'Yes' : '—'}</td>
                  {canDelete && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          await api.delete(`/articles/${a.id}`);
                          load();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
