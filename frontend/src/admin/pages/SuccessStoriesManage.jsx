import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function SuccessStoriesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    tag: '',
    caption: '',
    problem: '',
    action: '',
    result: '',
    fullBody: '',
    galleryCaptions: '',
  });
  const [hero, setHero] = useState(null);
  const [gallery, setGallery] = useState([]);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/success-stories?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '') fd.append(k, v);
    });
    if (hero) fd.append('hero', hero);
    gallery.forEach((f) => fd.append('gallery', f));
    try {
      await api.post('/success-stories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Success story published.');
      setForm({
        title: '',
        tag: '',
        caption: '',
        problem: '',
        action: '',
        result: '',
        fullBody: '',
        galleryCaptions: '',
      });
      setHero(null);
      setGallery([]);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Impact — success stories</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Cards show tag, title, problem / action / result. Click opens the full story with gallery.
        </p>
        {msg && (
          <div className={`admin-alert ${msg.includes('fail') ? 'admin-alert--error' : 'admin-alert--success'}`}>
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Category tag
            <input
              required
              placeholder="Senior Citizens"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          </label>
          <label>
            Photo caption
            <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          </label>
          <label>
            Hero / portrait image
            <input type="file" accept="image/*" onChange={(e) => setHero(e.target.files?.[0] || null)} />
          </label>
          <label>
            Problem
            <textarea rows={2} required value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
          </label>
          <label>
            Action
            <textarea rows={2} required value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} />
          </label>
          <label>
            Result
            <textarea rows={2} required value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
          </label>
          <label>
            Full story text
            <textarea rows={6} value={form.fullBody} onChange={(e) => setForm({ ...form, fullBody: e.target.value })} />
          </label>
          <label>
            Extra story images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGallery(Array.from(e.target.files || []))}
            />
          </label>
          <label>
            Gallery captions (one per line)
            <textarea
              rows={2}
              value={form.galleryCaptions}
              onChange={(e) => setForm({ ...form, galleryCaptions: e.target.value })}
            />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">
            Publish success story
          </button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Success stories ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tag</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.tag}</td>
                  {canDelete && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete?')) return;
                          await api.delete(`/success-stories/${s.id}`);
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
