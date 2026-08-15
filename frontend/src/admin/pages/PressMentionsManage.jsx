import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { assetUrl } from '../../lib/api';
import AdminImageHint from '../components/AdminImageHint';

const LAYOUTS = [
  { value: 'clip', label: 'Article clip (outlet + headline + optional link/image)' },
  { value: 'link', label: 'Press link (external URL required)' },
  { value: 'image', label: 'Image / clipping scan' },
  { value: 'quote', label: 'Quote card' },
  { value: 'video', label: 'Video (upload and/or YouTube / Vimeo)' },
  { value: 'pdf', label: 'PDF clipping / report' },
];

const emptyForm = {
  layout: 'clip',
  outlet: '',
  title: '',
  meta: '',
  url: '',
  imageCaption: '',
  quote: '',
  quoteAttribution: '',
  youtubeUrl: '',
  sortOrder: '0',
  published: 'true',
};

export default function PressMentionsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [editing, setEditing] = useState(null);
  const [clearImage, setClearImage] = useState(false);
  const [clearThumbnail, setClearThumbnail] = useState(false);
  const [clearVideo, setClearVideo] = useState(false);
  const [clearPdf, setClearPdf] = useState(false);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/press-mentions?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setThumbnail(null);
    setVideo(null);
    setPdf(null);
    setEditing(null);
    setClearImage(false);
    setClearThumbnail(false);
    setClearVideo(false);
    setClearPdf(false);
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({
      layout: item.layout || 'clip',
      outlet: item.outlet || '',
      title: item.title || '',
      meta: item.meta || '',
      url: item.url || '',
      imageCaption: item.imageCaption || '',
      quote: item.quote || '',
      quoteAttribution: item.quoteAttribution || '',
      youtubeUrl: item.youtubeUrl || '',
      sortOrder: String(item.sortOrder ?? 0),
      published: item.published === false ? 'false' : 'true',
    });
    setImage(null);
    setThumbnail(null);
    setVideo(null);
    setPdf(null);
    setClearImage(false);
    setClearThumbnail(false);
    setClearVideo(false);
    setClearPdf(false);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (form.layout === 'link' && !form.url.trim()) {
      setMsg('External press URL is required for link layout.');
      return;
    }
    if (form.layout === 'quote' && !form.quote.trim()) {
      setMsg('Quote text is required.');
      return;
    }
    if (form.layout === 'image' && !editing && !image) {
      setMsg('Image is required for image layout.');
      return;
    }
    if (form.layout === 'video' && !editing && !video && !form.youtubeUrl.trim()) {
      setMsg('Upload a video or paste a YouTube / Vimeo URL.');
      return;
    }
    if (form.layout === 'pdf' && !editing && !pdf) {
      setMsg('PDF is required for pdf layout.');
      return;
    }

    setBusy(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '') fd.append(k, v);
    });
    if (image) fd.append('image', image);
    if (thumbnail) fd.append('thumbnail', thumbnail);
    if (video) fd.append('video', video);
    if (pdf) fd.append('pdf', pdf);
    try {
      if (editing) {
        if (clearImage && !image) fd.append('clearImage', 'true');
        if (clearThumbnail && !thumbnail) fd.append('clearThumbnail', 'true');
        if (clearVideo && !video) fd.append('clearVideo', 'true');
        if (clearPdf && !pdf) fd.append('clearPdf', 'true');
        await api.put(`/press-mentions/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 180000,
        });
        setMsg('Press mention updated.');
      } else {
        await api.post('/press-mentions', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 180000,
        });
        setMsg('Press mention published.');
      }
      resetForm();
      e.target.reset?.();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const showImageField = ['clip', 'link', 'image'].includes(form.layout);
  const showVideoFields = form.layout === 'video';
  const showPdfField = form.layout === 'pdf';
  const showUrlField = ['clip', 'link', 'image', 'video', 'pdf'].includes(form.layout);

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit press mention' : 'Impact — Press mentions'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Full media support: article clips, press links, images, quotes, uploaded video, YouTube/Vimeo, and
          PDFs. Pick a layout, then fill the matching fields.
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') ||
              msg.toLowerCase().includes('required') ||
              msg.toLowerCase().includes('upload')
                ? 'admin-alert--error'
                : 'admin-alert--success'
            }`}
          >
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Layout
            <select value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })}>
              {LAYOUTS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Title / headline
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>

          {['clip', 'link', 'video', 'pdf'].includes(form.layout) ? (
            <label>
              Outlet
              <input
                placeholder="The Hindu"
                value={form.outlet}
                onChange={(e) => setForm({ ...form, outlet: e.target.value })}
                required={form.layout === 'clip' || form.layout === 'link'}
              />
            </label>
          ) : null}

          <label>
            Meta line
            <input
              placeholder="National · November 2024"
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
            />
          </label>

          {showUrlField ? (
            <label>
              External press / article URL {form.layout === 'link' ? '(required)' : '(optional)'}
              <input
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required={form.layout === 'link'}
              />
            </label>
          ) : null}

          {form.layout === 'quote' ? (
            <>
              <label>
                Quote
                <textarea
                  rows={3}
                  required
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                />
              </label>
              <label>
                Attribution
                <input
                  placeholder="· Regional daily, on the foundation's ninth year"
                  value={form.quoteAttribution}
                  onChange={(e) => setForm({ ...form, quoteAttribution: e.target.value })}
                />
              </label>
            </>
          ) : null}

          {form.layout === 'image' || form.layout === 'clip' ? (
            <label>
              Image caption
              <input
                value={form.imageCaption}
                onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
              />
            </label>
          ) : null}

          {showVideoFields ? (
            <label>
              YouTube / Vimeo URL
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=…"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              />
            </label>
          ) : null}

          {editing && showImageField && editing.image && !clearImage ? (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#5a6f82' }}>Current image</p>
              <img src={assetUrl(editing.image)} alt="" style={{ maxWidth: 180, borderRadius: 8, display: 'block' }} />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setClearImage(true)}>
                Remove image
              </button>
            </div>
          ) : null}

          {showImageField ? (
            <label>
              Image {form.layout === 'image' && !editing ? '(required)' : '(optional / leave empty to keep)'}
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              <AdminImageHint size="900×1200 px" note="3:4 portrait — Impact press mosaic tiles" />
            </label>
          ) : null}

          {showVideoFields && editing?.thumbnail && !clearThumbnail ? (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#5a6f82' }}>Current thumbnail</p>
              <img
                src={assetUrl(editing.thumbnail)}
                alt=""
                style={{ maxWidth: 180, borderRadius: 8, display: 'block' }}
              />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setClearThumbnail(true)}>
                Remove thumbnail
              </button>
            </div>
          ) : null}

          {showVideoFields ? (
            <>
              <label>
                Thumbnail (optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
                <AdminImageHint size="1280×720 px" note="16:9 video poster for press embeds" />
              </label>
              {editing?.video && !clearVideo ? (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#5a6f82' }}>
                    Current uploaded video on file
                  </p>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setClearVideo(true)}>
                    Remove uploaded video
                  </button>
                </div>
              ) : null}
              <label>
                Video file (mp4/webm/mov, up to 100MB)
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
                  onChange={(e) => setVideo(e.target.files?.[0] || null)}
                />
              </label>
            </>
          ) : null}

          {showPdfField && editing?.pdf && !clearPdf ? (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#5a6f82' }}>Current PDF on file</p>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setClearPdf(true)}>
                Remove PDF
              </button>
            </div>
          ) : null}

          {showPdfField ? (
            <label>
              PDF {editing ? '(leave empty to keep current)' : '(required)'}
              <input
                type="file"
                accept="application/pdf,.pdf"
                required={!editing}
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
              />
            </label>
          ) : null}

          <label>
            Published
            <select value={form.published} onChange={(e) => setForm({ ...form, published: e.target.value })}>
              <option value="true">Published</option>
              <option value="false">Draft (hidden)</option>
            </select>
          </label>

          <label>
            Sort order
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? 'Saving…' : editing ? 'Save changes' : 'Publish'}
            </button>
            {editing ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Press mentions ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Layout</th>
                <th>Title / outlet</th>
                <th>Media</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.layout}</td>
                  <td>
                    {item.outlet ? `${item.outlet} — ` : ''}
                    {item.title}
                  </td>
                  <td>
                    {[
                      item.image && 'image',
                      item.video && 'video file',
                      item.youtubeUrl && 'youtube',
                      item.pdf && 'pdf',
                      item.url && 'link',
                    ]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </td>
                  <td>{item.published === false ? 'Draft' : 'Yes'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete?')) return;
                          await api.delete(`/press-mentions/${item.id}`);
                          if (editing?.id === item.id) resetForm();
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
