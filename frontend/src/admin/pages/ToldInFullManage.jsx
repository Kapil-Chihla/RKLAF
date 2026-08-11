import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { assetUrl } from '../../lib/api';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  title: '',
  tag: '',
  caption: '',
  problem: '',
  action: '',
  result: '',
  sortOrder: '0',
};

export default function ToldInFullManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [hero, setHero] = useState(null);
  const [editing, setEditing] = useState(null);
  const [clearHero, setClearHero] = useState(false);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/told-in-full?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setHero(null);
    setEditing(null);
    setClearHero(false);
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      tag: item.tag || '',
      caption: item.caption || '',
      problem: item.problem || '',
      action: item.action || '',
      result: item.result || '',
      sortOrder: String(item.sortOrder ?? 0),
    });
    setHero(null);
    setClearHero(false);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '') fd.append(k, v);
    });
    if (hero) fd.append('hero', hero);
    try {
      if (editing) {
        if (clearHero && !hero) fd.append('clearHero', 'true');
        await api.put(`/told-in-full/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Told in full story updated.');
      } else {
        await api.post('/told-in-full', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Told in full story published.');
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit told in full' : 'Impact — Told in full'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Delhi prisons programme stories (problem / action / result) on the Impact page.
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') ? 'admin-alert--error' : 'admin-alert--success'
            }`}
          >
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Tag
            <input
              required
              placeholder="Appeal restored"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          </label>
          <label>
            Photo caption
            <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          </label>
          {editing?.heroImage && !clearHero ? (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#5a6f82' }}>Current hero</p>
              <img
                src={assetUrl(editing.heroImage)}
                alt=""
                style={{ maxWidth: 180, borderRadius: 8, display: 'block' }}
              />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setClearHero(true)}>
                Remove hero
              </button>
            </div>
          ) : null}
          <label>
            Hero image {editing ? '(leave empty to keep current)' : ''}
            <input type="file" accept="image/*" onChange={(e) => setHero(e.target.files?.[0] || null)} />
          </label>
          <label>
            Problem
            <AdminRichHint />
            <textarea rows={3} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
          </label>
          <label>
            Action
            <AdminRichHint />
            <textarea rows={3} value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} />
          </label>
          <label>
            Result
            <AdminRichHint />
            <textarea rows={3} value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
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
            <button type="submit" className="admin-btn admin-btn--primary">
              {editing ? 'Save changes' : 'Publish'}
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
        <h2>Told in full ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Title</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.tag}</td>
                  <td>{item.title}</td>
                  <td>{item.heroImage ? 'Yes' : '—'}</td>
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
                          await api.delete(`/told-in-full/${item.id}`);
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
