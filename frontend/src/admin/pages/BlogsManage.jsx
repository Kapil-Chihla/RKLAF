import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function BlogsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    sections: '',
    author: '',
    kind: 'blog',
  });
  const [image, setImage] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/blogs?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('excerpt', form.excerpt);
    fd.append('content', form.content);
    fd.append('sections', form.sections);
    fd.append('author', form.author || user?.name || '');
    fd.append('kind', form.kind);
    if (image) fd.append('image', image);
    try {
      await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg(form.kind === 'experience' ? 'Experience published.' : 'Blog published.');
      setForm({ title: '', excerpt: '', content: '', sections: '', author: '', kind: form.kind });
      setImage(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  const remove = async (id) => {
    if (!canDelete || !confirm('Delete this post?')) return;
    await api.delete(`/blogs/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Academics — blogs & experiences</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Latest posts appear first. Use sections with <code>## Heading</code> blocks for point-wise full articles.
        </p>
        {msg && (
          <div className={`admin-alert ${msg.includes('fail') ? 'admin-alert--error' : 'admin-alert--success'}`}>
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Type
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="blog">Blog</option>
              <option value="experience">Experience from the ground</option>
            </select>
          </label>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Short description (listing)
            <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </label>
          <label>
            Full story (plain text, optional if using sections)
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </label>
          <label>
            Point-wise sections
            <textarea
              rows={8}
              placeholder={'## First section\nBody text…\n\n## Second section\nMore text…'}
              value={form.sections}
              onChange={(e) => setForm({ ...form, sections: e.target.value })}
            />
          </label>
          <label>
            Author
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </label>
          <label>
            Hero image
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">
            Publish
          </button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Published ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.kind || 'blog'}</td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  {canDelete && (
                    <td>
                      <button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(b.id)}>
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
