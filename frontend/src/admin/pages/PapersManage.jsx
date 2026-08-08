import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const emptyForm = { title: '', kind: 'research', meta: '' };

export default function PapersManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/papers?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm({ ...emptyForm, kind: form.kind || 'research' });
    setFile(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      kind: item.kind || 'research',
      meta: item.meta || '',
    });
    setFile(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!editingId && !file) {
      setMsg('PDF is required for new papers.');
      return;
    }
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('kind', form.kind);
    fd.append('meta', form.meta);
    if (file) fd.append('file', file);
    try {
      if (editingId) {
        await api.put(`/papers/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Paper updated.');
      } else {
        await api.post('/papers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Paper uploaded.');
      }
      clearForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editingId ? 'Edit paper' : 'Academics — research & white papers'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          PDF + title (+ optional meta line). Appears under Research or White Papers.
          {editingId ? ' Leave PDF empty to keep the current file.' : ''}
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
            PDF {editingId ? '(leave empty to keep current)' : ''}
            <input
              type="file"
              accept="application/pdf,.pdf"
              required={!editingId}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editingId ? 'Save changes' : 'Upload paper'}
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
        <h2>Papers ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Kind</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.kind}</td>
                  <td>{p.file ? 'Yes' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete?')) return;
                          await api.delete(`/papers/${p.id}`);
                          if (editingId === p.id) clearForm();
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
