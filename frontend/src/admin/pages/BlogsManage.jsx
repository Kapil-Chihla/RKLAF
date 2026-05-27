import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function BlogsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', author: '' });
  const [image, setImage] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/blogs').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('excerpt', form.excerpt);
    fd.append('content', form.content);
    fd.append('author', form.author || user?.name || '');
    if (image) fd.append('image', image);
    try {
      await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Blog published.');
      setForm({ title: '', excerpt: '', content: '', author: '' });
      setImage(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  const remove = async (id) => {
    if (!canDelete || !confirm('Delete this blog?')) return;
    await api.delete(`/blogs/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Upload blog</h2>
        {msg && <div className={`admin-alert ${msg.includes('failed') ? 'admin-alert--error' : 'admin-alert--success'}`}>{msg}</div>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Excerpt<input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></label>
          <label>Content<textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
          <label>Author<input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
          <label>Cover image<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} /></label>
          <button type="submit" className="admin-btn admin-btn--primary">Publish blog</button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Published blogs ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Date</th>{canDelete && <th>Actions</th>}</tr></thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  {canDelete && <td><button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(b.id)}>Delete</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
