import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function CampsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', location: '', date: '', description: '' });
  const [image, setImage] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/camps').then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      await api.post('/camps', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Camp added.');
      setForm({ title: '', location: '', date: '', description: '' });
      setImage(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Upload camp</h2>
        {msg && <div className="admin-alert admin-alert--success">{msg}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
          <label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Image<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} /></label>
          <button type="submit" className="admin-btn admin-btn--primary">Add camp</button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Camps ({items.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Location</th><th>Date</th>{canDelete && <th>Actions</th>}</tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.location}</td>
                <td>{c.date}</td>
                {canDelete && <td><button type="button" className="admin-btn admin-btn--danger" onClick={async () => { await api.delete(`/camps/${c.id}`); load(); }}>Delete</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
