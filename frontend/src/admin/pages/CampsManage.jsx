import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { assetUrl } from '../../lib/api';

const emptyForm = {
  title: '',
  location: '',
  date: '',
  summary: '',
  description: '',
  tags: '',
};

export default function CampsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [heroPickerIndex, setHeroPickerIndex] = useState(0);
  const [editing, setEditing] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/camps?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return undefined;
    }
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  useEffect(() => {
    if (!heroFile) {
      setHeroPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(heroFile);
    setHeroPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [heroFile]);

  const existingImages = editing?.images || [];

  const pickerItems = useMemo(() => {
    const existing = existingImages.map((img, index) => ({
      key: `existing-${img.id || index}`,
      kind: 'existing',
      url: img.url,
      index,
      label: `Photo ${index + 1}`,
    }));
    const incoming = previews.map((url, index) => ({
      key: `new-${index}`,
      kind: 'new',
      url,
      index,
      label: `New photo ${index + 1}`,
    }));
    return [...existing, ...incoming];
  }, [existingImages, previews]);

  useEffect(() => {
    if (heroPickerIndex >= pickerItems.length) {
      setHeroPickerIndex(0);
    }
  }, [heroPickerIndex, pickerItems.length]);

  const resetForm = () => {
    setForm(emptyForm);
    setFiles([]);
    setPreviews([]);
    setHeroFile(null);
    setHeroPreview(null);
    setHeroPickerIndex(0);
    setEditing(null);
  };

  const startEdit = (camp) => {
    setEditing(camp);
    setForm({
      title: camp.title || '',
      location: camp.location || '',
      date: camp.date || '',
      summary: camp.summary || '',
      description: camp.description || '',
      tags: (camp.tags || []).join(', '),
    });
    setFiles([]);
    setPreviews([]);
    setHeroFile(null);
    setHeroPreview(null);
    const heroUrl = camp.heroImage || camp.coverImage;
    const heroIdx = camp.images?.findIndex((img) => img.url === heroUrl);
    setHeroPickerIndex(heroIdx >= 0 ? heroIdx : 0);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const appendHeroSelection = (fd) => {
    if (heroFile) {
      fd.append('hero', heroFile);
      return;
    }

    const selected = pickerItems[heroPickerIndex];
    if (!selected) return;

    if (selected.kind === 'existing') {
      fd.append('heroImage', selected.url);
      return;
    }

    fd.append('heroIndex', String(selected.index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    files.forEach((file) => fd.append('images', file));

    try {
      if (editing) {
        if (existingImages.length) {
          fd.append('imagesJson', JSON.stringify(existingImages));
        }
        appendHeroSelection(fd);
        await api.put(`/camps/${editing.id}`, fd);
        setMsg('Camp updated.');
      } else {
        if (!files.length && !heroFile) {
          setMsg('Add album photos and/or a hero image.');
          return;
        }
        appendHeroSelection(fd);
        await api.post('/camps', fd);
        setMsg('Camp album published.');
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!canDelete || !confirm('Delete this camp album?')) return;
    await api.delete(`/camps/${id}`);
    if (editing?.id === id) resetForm();
    load();
  };

  const currentHeroPreview = heroPreview
    || (editing && !heroFile && (editing.heroImage || editing.coverImage)
      ? assetUrl(editing.heroImage || editing.coverImage)
      : null);

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit camp album' : 'Create camp album'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Hero image appears on gallery cards and the camp page banner. Album photos appear inside the camp gallery.
        </p>
        {msg && (
          <div className={`admin-alert ${msg.includes('failed') || msg.includes('Add ') ? 'admin-alert--error' : 'admin-alert--success'}`}>
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <label>
            Date
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            Summary
            <input
              value={form.summary}
              placeholder="Short line shown on gallery cards"
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>
          <label>
            About this camp
            <textarea
              rows={5}
              value={form.description}
              placeholder="Full story shown at the top of the camp detail page"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Tags
            <input
              value={form.tags}
              placeholder="Legal Camp, RTI Drive (comma separated)"
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </label>

          <label>
            Hero image (gallery card &amp; page banner)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
            />
          </label>

          {currentHeroPreview && (
            <div className="admin-camp-hero-preview">
              <p><strong>Current hero preview</strong></p>
              <img src={currentHeroPreview} alt="" />
            </div>
          )}

          <label>
            Album photos (select multiple)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                setFiles(selected);
                if (!editing && !heroFile) setHeroPickerIndex(0);
              }}
            />
          </label>

          {!heroFile && pickerItems.length > 0 && (
            <div className="admin-camp-previews">
              <p><strong>Or pick hero from album</strong> — click a photo below</p>
              <div className="admin-camp-previews__grid">
                {pickerItems.map((item, index) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`admin-camp-preview ${heroPickerIndex === index ? 'is-cover' : ''}`}
                    onClick={() => setHeroPickerIndex(index)}
                  >
                    <img
                      src={item.kind === 'new' ? item.url : assetUrl(item.url)}
                      alt=""
                    />
                    <span>{heroPickerIndex === index ? 'Hero' : item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {editing && existingImages.length > 0 && !files.length && (
            <p style={{ fontSize: '0.88rem', color: '#5a6f82' }}>
              Existing album: {existingImages.length} photo(s). Upload more files above to add to this camp.
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editing ? 'Save changes' : 'Publish camp album'}
            </button>
            {editing && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Camp albums ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hero</th>
                <th>Title</th>
                <th>Location</th>
                <th>Photos</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((camp) => (
                <tr key={camp.id}>
                  <td>
                    {(camp.heroImage || camp.coverImage) ? (
                      <img src={assetUrl(camp.heroImage || camp.coverImage)} alt="" className="admin-camp-thumb" />
                    ) : '—'}
                  </td>
                  <td>{camp.title}</td>
                  <td>{camp.location || '—'}</td>
                  <td>{camp.images?.length || 0}</td>
                  <td>{camp.date || '—'}</td>
                  <td>
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={() => startEdit(camp)}>
                      Edit
                    </button>
                    {canDelete && (
                      <button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(camp.id)}>
                        Delete
                      </button>
                    )}
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
