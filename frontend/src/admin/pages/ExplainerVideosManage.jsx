import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function ExplainerVideosManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: '', meta: '', externalUrl: '' });
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () =>
    api.get('/explainer-videos?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!video && !form.externalUrl.trim()) {
      setMsg('Upload a video file or paste an external URL.');
      return;
    }
    setBusy(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('meta', form.meta);
    if (form.externalUrl.trim()) fd.append('externalUrl', form.externalUrl.trim());
    if (video) fd.append('video', video);
    if (thumbnail) fd.append('thumbnail', thumbnail);
    try {
      await api.post('/explainer-videos', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000,
      });
      setMsg('Video published.');
      setForm({ title: '', meta: '', externalUrl: '' });
      setVideo(null);
      setThumbnail(null);
      e.target.reset?.();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Know Your Rights — explainer videos</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Thumbnail + title + meta line, plus a video file (mp4/webm/mov, up to 100MB) or a YouTube /
          Vimeo link. Cards appear in the public KYR carousel — scroll expands as you add more.
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('upload a video')
                ? 'admin-alert--error'
                : 'admin-alert--success'
            }`}
          >
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="The Senior Citizens Act in 8 minutes"
            />
          </label>
          <label>
            Meta line
            <input
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
              placeholder="2 min · Hindi & English subtitles"
            />
          </label>
          <label>
            Thumbnail image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            />
          </label>
          <label>
            Video file
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />
          </label>
          <label>
            Or external URL (YouTube / Vimeo / direct)
            <input
              type="url"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
            {busy ? 'Uploading…' : 'Publish video'}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Videos ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Meta</th>
                <th>Thumb</th>
                <th>Source</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id}>
                  <td>{v.title}</td>
                  <td>{v.meta || '—'}</td>
                  <td>{v.thumbnail ? 'Yes' : '—'}</td>
                  <td>{v.video ? 'Uploaded file' : v.externalUrl ? 'External URL' : '—'}</td>
                  {canDelete && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this video?')) return;
                          await api.delete(`/explainer-videos/${v.id}`);
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
