import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const CATEGORIES = [
  'General',
  'Women Rights',
  'Child Rights',
  'Labor Law',
  'Property Rights',
  'Consumer Rights',
  'Criminal Law',
];

export default function ArticlesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', summary: '', body: '', category: 'General' });
  const [file, setFile] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/articles').then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('summary', form.summary);
    fd.append('body', form.body);
    fd.append('category', form.category);
    if (file) fd.append('file', file);
    try {
      await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Article uploaded.');
      setForm({ title: '', summary: '', body: '', category: 'General' });
      setFile(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Know Your Rights — downloadable guides</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          PDFs uploaded here appear on the public Know Your Rights page. Attach a file for each guide.
        </p>
        {msg && <div className="admin-alert admin-alert--success">{msg}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Summary<input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
          <label>
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>Body<textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
          <label>PDF / file attachment<input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
          <button type="submit" className="admin-btn admin-btn--primary">Upload article</button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Articles ({items.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>File</th>{canDelete && <th>Actions</th>}</tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.category || 'General'}</td>
                <td>{a.file ? 'Yes' : '—'}</td>
                {canDelete && <td><button type="button" className="admin-btn admin-btn--danger" onClick={async () => { await api.delete(`/articles/${a.id}`); load(); }}>Delete</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
