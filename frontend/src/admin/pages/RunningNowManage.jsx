import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  status: 'In trial',
  title: '',
  allegation: '',
  reliefSought: '',
  stage: '',
  sortOrder: '0',
};

export default function RunningNowManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  
  const load = () => api.get('/running-now?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      status: item.status || 'In trial',
      title: item.title || '',
      allegation: item.allegation || '',
      reliefSought: item.reliefSought || '',
      stage: item.stage || '',
      sortOrder: String(item.sortOrder ?? 0),
    });
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editingId) {
        await api.put(`/running-now/${editingId}`, form);
        setMsg('Running now item updated.');
      } else {
        await api.post('/running-now', form);
        setMsg('Running now item published.');
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
        <h2>{editingId ? 'Edit running now' : 'Impact — Running now'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Pending matters on the Impact page. Status, allegation, relief sought, and stage.
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
            Status
            <input
              required
              placeholder="In trial"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </label>
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Allegation
            <AdminRichHint />
            <textarea
              rows={3}
              value={form.allegation}
              onChange={(e) => setForm({ ...form, allegation: e.target.value })}
            />
          </label>
          <label>
            Relief sought
            <AdminRichHint />
            <textarea
              rows={3}
              value={form.reliefSought}
              onChange={(e) => setForm({ ...form, reliefSought: e.target.value })}
            />
          </label>
          <label>
            Stage
            <AdminRichHint />
            <textarea rows={2} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} />
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
        <h2>Running now ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.status}</td>
                  <td>{item.title}</td>
                  <td>{item.sortOrder}</td>
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
                          await api.delete(`/running-now/${item.id}`);
                          if (editingId === item.id) clearForm();
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
