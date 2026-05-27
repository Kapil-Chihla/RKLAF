import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function CasesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', description: '', area: '', status: 'active' });
  const [image, setImage] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/cases').then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      await api.post('/cases', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Case added.');
      setForm({ title: '', description: '', area: '', status: 'active' });
      setImage(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Upload case</h2>
        {msg && <div className="admin-alert admin-alert--success">{msg}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Area<input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Civil, Criminal, Human Rights" /></label>
          <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Image<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} /></label>
          <button type="submit" className="admin-btn admin-btn--primary">Add case</button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Cases ({items.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Area</th>{canDelete && <th>Actions</th>}</tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.area}</td>
                {canDelete && <td><button type="button" className="admin-btn admin-btn--danger" onClick={async () => { await api.delete(`/cases/${c.id}`); load(); }}>Delete</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
