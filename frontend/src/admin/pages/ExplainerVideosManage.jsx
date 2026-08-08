import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const emptyForm = { title: '', meta: '', externalUrl: '' };

export default function ExplainerVideosManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () =>
    api.get('/explainer-videos?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setVideo(null);
    setThumbnail(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      meta: item.meta || '',
      externalUrl: item.externalUrl || '',
    });
    setVideo(null);
    setThumbnail(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!editingId && !video && !form.externalUrl.trim()) {
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
      if (editingId) {
        await api.put(`/explainer-videos/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 180000,
        });
        setMsg('Video updated.');
      } else {
        await api.post('/explainer-videos', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 180000,
        });
        setMsg('Video published.');
      }
      clearForm();
      e.target.reset?.();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editingId ? 'Edit explainer video' : 'Know Your Rights — explainer videos'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Thumbnail + title + meta line, plus a video file (mp4/webm/mov, up to 100MB) or a YouTube /
          Vimeo link. Cards appear in the public KYR carousel — scroll expands as you add more.
          {editingId
            ? ' Video, URL, and thumbnail are optional when editing — leave empty to keep current media.'
            : ''}
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') ||
              msg.toLowerCase().includes('upload a video') ||
              msg.toLowerCase().includes('keep a video')
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
            Thumbnail image {editingId ? '(leave empty to keep current)' : ''}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            />
          </label>
          <label>
            Video file {editingId ? '(optional — leave empty to keep current)' : ''}
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
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? 'Saving…' : editingId ? 'Save changes' : 'Publish video'}
            </button>
            {editingId ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearForm} disabled={busy}>
                Cancel edit
              </button>
            ) : null}
          </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id}>
                  <td>{v.title}</td>
                  <td>{v.meta || '—'}</td>
                  <td>{v.thumbnail ? 'Yes' : '—'}</td>
                  <td>{v.video ? 'Uploaded file' : v.externalUrl ? 'External URL' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(v)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this video?')) return;
                          await api.delete(`/explainer-videos/${v.id}`);
                          if (editingId === v.id) clearForm();
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
