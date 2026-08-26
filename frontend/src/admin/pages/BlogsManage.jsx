import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminImageHint from '../components/AdminImageHint';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  sections: '',
  author: '',
  kind: 'blog',
};

function sectionsToText(sections) {
  if (!sections?.length) return '';
  if (typeof sections === 'string') return sections;
  return sections
    .map((s) => `## ${s.heading || ''}\n${s.body || ''}`.trimEnd())
    .join('\n\n');
}

export default function BlogsManage() {
  const { user, canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const load = () => api.get('/blogs?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm({ ...emptyForm, kind: form.kind || 'blog' });
    setImage(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      sections: sectionsToText(item.sections),
      author: item.author || '',
      kind: item.kind === 'experience' ? 'experience' : 'blog',
    });
    setImage(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      if (editingId) {
        await api.put(`/blogs/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg(form.kind === 'experience' ? 'Experience updated.' : 'Blog updated.');
      } else {
        await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg(form.kind === 'experience' ? 'Experience published.' : 'Blog published.');
      }
      clearForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!canDelete || !confirm('Delete this post?')) return;
    await api.delete(`/blogs/${id}`);
    if (editingId === id) clearForm();
    load();
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editingId ? 'Edit blog / experience' : 'Academics — blogs & experiences'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Latest posts appear first. Use sections with <code>## Heading</code> blocks for point-wise full articles.
          {editingId ? ' Leave image empty to keep the current hero.' : ''}
        </p>
        {msg && (
          <div className={`admin-alert ${msg.toLowerCase().includes('fail') ? 'admin-alert--error' : 'admin-alert--success'}`}>
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
            <AdminRichHint />
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </label>
          <label>
            Point-wise sections
            <AdminRichHint />
            <textarea
              rows={8}
              placeholder={'## First section\nBody text with **bold** words…\n\n## Second section\nMore text…'}
              value={form.sections}
              onChange={(e) => setForm({ ...form, sections: e.target.value })}
            />
          </label>
          <label>
            Author
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </label>
          <label>
            Hero image {editingId ? '(leave empty to keep current)' : ''}
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            <AdminImageHint
              size="2400×1600 px"
              note="landscape — blog detail + Academics cards; keep the subject centered for cover crops"
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editingId ? 'Save changes' : 'Publish'}
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
        <h2>Published ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.kind || 'blog'}</td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(b)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(b.id)}>
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
