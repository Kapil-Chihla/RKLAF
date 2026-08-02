import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function DeskStoriesManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    kicker: 'Senior Citizens',
    listingDescription: '',
    fullHeader: '',
    fullBody: '',
    number: '',
    galleryCaptions: '',
  });
  const [hero, setHero] = useState(null);
  const [gallery, setGallery] = useState([]);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/desk-stories?all=true').then((r) => setItems(r.data)).catch(() => {});

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
      await api.post('/desk-stories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Desk story published.');
      setForm({
        title: '',
        kicker: 'Senior Citizens',
        listingDescription: '',
        fullHeader: '',
        fullBody: '',
        number: '',
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
        <h2>The Desk — case stories</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Stories appear in zigzag order on Our Work. Gallery images + captions show on the full story page.
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
            Category / kicker
            <input value={form.kicker} onChange={(e) => setForm({ ...form, kicker: e.target.value })} />
          </label>
          <label>
            Project number (optional)
            <input
              type="number"
              min="1"
              placeholder="Auto"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </label>
          <label>
            Listing description
            <textarea
              rows={4}
              required
              value={form.listingDescription}
              onChange={(e) => setForm({ ...form, listingDescription: e.target.value })}
            />
          </label>
          <label>
            Hero photo
            <input type="file" accept="image/*" onChange={(e) => setHero(e.target.files?.[0] || null)} />
          </label>
          <label>
            Full story header
            <input
              value={form.fullHeader}
              onChange={(e) => setForm({ ...form, fullHeader: e.target.value })}
              placeholder="Defaults to title"
            />
          </label>
          <label>
            Full account
            <textarea
              rows={8}
              value={form.fullBody}
              onChange={(e) => setForm({ ...form, fullBody: e.target.value })}
            />
          </label>
          <label>
            Story images (gallery)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGallery(Array.from(e.target.files || []))}
            />
          </label>
          <label>
            Gallery captions (one per line, same order as images)
            <textarea
              rows={3}
              value={form.galleryCaptions}
              onChange={(e) => setForm({ ...form, galleryCaptions: e.target.value })}
            />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">
            Publish desk story
          </button>
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Desk stories ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Kicker</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{String(s.number).padStart(2, '0')}</td>
                  <td>{s.title}</td>
                  <td>{s.kicker}</td>
                  {canDelete && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete?')) return;
                          await api.delete(`/desk-stories/${s.id}`);
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
