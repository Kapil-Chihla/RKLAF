import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const emptyForm = { name: '', role: '', bio: '' };

export default function TeamManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const canEdit = ['super_admin', 'admin'].includes(user?.role);
  const canDelete = canEdit;

  const load = () => api.get('/team').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setImage(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      role: item.role || '',
      bio: item.bio || '',
    });
    setImage(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setMsg('');
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('role', form.role);
    fd.append('bio', form.bio);
    if (image) fd.append('image', image);
    try {
      if (editingId) {
        await api.put(`/team/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Team member updated.');
      } else {
        await api.post('/team', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Team member added.');
      }
      clearForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editingId ? 'Edit team member' : 'Public team profiles'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Name, role, bio, and photo for the public About / team section.
          {editingId ? ' Leave image empty to keep the current photo.' : ''}
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
        {canEdit ? (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Role
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Founder & Managing Trustee"
              />
            </label>
            <label>
              Bio
              <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </label>
            <label>
              Photo {editingId ? '(leave empty to keep current)' : ''}
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="submit" className="admin-btn admin-btn--primary">
                {editingId ? 'Save changes' : 'Add team member'}
              </button>
              {editingId ? (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        ) : (
          <p style={{ color: '#5a6f82' }}>Only admins can add or edit team profiles.</p>
        )}
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Team ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.role}</td>
                  <td>{m.image ? 'Yes' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {canEdit ? (
                      <button type="button" className="admin-btn" onClick={() => startEdit(m)}>
                        Edit
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this team member?')) return;
                          await api.delete(`/team/${m.id}`);
                          if (editingId === m.id) clearForm();
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
