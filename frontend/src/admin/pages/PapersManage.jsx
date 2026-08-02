import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function PapersManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', kind: 'research', meta: '' });
  const [file, setFile] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/papers?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('kind', form.kind);
    fd.append('meta', form.meta);
    if (file) fd.append('file', file);
    try {
      await api.post('/papers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Paper uploaded.');
      setForm({ title: '', kind: form.kind, meta: '' });
      setFile(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Academics — research & white papers</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>PDF + title (+ optional meta line). Appears under Research or White Papers.</p>
        {msg && (
          <div className={`admin-alert ${msg.includes('fail') ? 'admin-alert--error' : 'admin-alert--success'}`}>
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Type
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="research">Research</option>
              <option value="white-paper">White paper</option>
            </select>
          </label>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Meta line
            <input
              placeholder="Research brief · 2026 · 28 pages"
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
            />
          </label>
          <label>
            PDF
            <input type="file" accept="application/pdf,.pdf" required onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">
            Upload paper
          </button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Papers ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Kind</th>
                <th>File</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.kind}</td>
                  <td>{p.file ? 'Yes' : '—'}</td>
                  {canDelete && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete?')) return;
                          await api.delete(`/papers/${p.id}`);
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
