import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  kind: 'audio',
  title: '',
  meta: '',
  description: '',
  externalUrl: '',
};

export default function LibraryPodcastsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [media, setMedia] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () =>
    api.get('/library-podcasts?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setMedia(null);
    setThumbnail(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      kind: item.kind || 'audio',
      title: item.title || '',
      meta: item.meta || '',
      description: item.description || '',
      externalUrl: item.externalUrl || '',
    });
    setMedia(null);
    setThumbnail(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!editingId && !media && !form.externalUrl.trim()) {
      setMsg(
        form.kind === 'audio'
          ? 'Upload an audio file or paste a Spotify / direct audio URL.'
          : 'Upload a video file or paste a YouTube / Vimeo / direct URL.',
      );
      return;
    }
    setBusy(true);
    const fd = new FormData();
    fd.append('kind', form.kind);
    fd.append('title', form.title);
    fd.append('meta', form.meta);
    fd.append('description', form.description);
    if (form.externalUrl.trim()) fd.append('externalUrl', form.externalUrl.trim());
    if (media) fd.append('media', media);
    if (thumbnail) fd.append('thumbnail', thumbnail);
    try {
      if (editingId) {
        await api.put(`/library-podcasts/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 180000,
        });
        setMsg('Podcast updated.');
      } else {
        await api.post('/library-podcasts', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 180000,
        });
        setMsg('Podcast published.');
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
        <h2>{editingId ? 'Edit library podcast' : 'Library — audio & video podcasts'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Publish episodes for the public Library page. Use a Spotify episode/show link for audio, or a
          YouTube link for video — or upload the file directly. The latest episode appears in the top
          player; the page shows the top 5 of each kind.
          {editingId ? ' Media and URL are optional when editing — leave empty to keep current.' : ''}
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') ||
              msg.toLowerCase().includes('upload') ||
              msg.toLowerCase().includes('keep a')
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
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              required
            >
              <option value="audio">Audio podcast</option>
              <option value="video">Video podcast</option>
            </select>
          </label>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Can your children legally evict you?"
            />
          </label>
          <label>
            Meta line
            <input
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
              placeholder="Senior Citizens · Ep. 42"
            />
          </label>
          <label>
            Short description
            <AdminRichHint />
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="One or two sentences for the Library cards."
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
            {form.kind === 'audio' ? 'Audio file' : 'Video file'}{' '}
            {editingId ? '(optional — leave empty to keep current)' : ''}
            <input
              type="file"
              accept={
                form.kind === 'audio'
                  ? 'audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/aac,.mp3,.m4a,.wav,.ogg,.aac'
                  : 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v'
              }
              onChange={(e) => setMedia(e.target.files?.[0] || null)}
            />
          </label>
          <label>
            Or external URL{' '}
            {form.kind === 'audio'
              ? '(Spotify episode / show / direct .mp3)'
              : '(YouTube / Vimeo / Google Drive / direct .mp4 — not OneDrive share pages)'}
            <input
              type="url"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              placeholder={
                form.kind === 'audio'
                  ? 'https://open.spotify.com/episode/…'
                  : 'https://www.youtube.com/watch?v=…'
              }
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? 'Saving…' : editingId ? 'Save changes' : 'Publish podcast'}
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
        <h2>Episodes ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Meta</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.kind}</td>
                  <td>{p.title}</td>
                  <td>{p.meta || '—'}</td>
                  <td>{p.media ? 'Uploaded file' : p.externalUrl ? 'External URL' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this podcast?')) return;
                          await api.delete(`/library-podcasts/${p.id}`);
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
