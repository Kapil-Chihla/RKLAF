import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  year: '',
  header: '',
  description: '',
  statusChip: '',
  sortOrder: '0',
};

export default function AlsoOnRecordManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const load = () => api.get('/also-on-record?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const clearForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      year: item.year || '',
      header: item.header || '',
      description: item.description || '',
      statusChip: item.statusChip || '',
      sortOrder: String(item.sortOrder ?? 0),
    });
    setFile(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!editingId && !file) {
      setMsg('PDF is required for new records.');
      return;
    }
    const fd = new FormData();
    fd.append('year', form.year);
    fd.append('header', form.header);
    fd.append('description', form.description);
    fd.append('statusChip', form.statusChip);
    fd.append('sortOrder', form.sortOrder);
    if (file) fd.append('file', file);
    try {
      if (editingId) {
        await api.put(`/also-on-record/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Record updated.');
      } else {
        await api.post('/also-on-record', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Record uploaded.');
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
        <h2>{editingId ? 'Edit also on record' : 'Impact — Also on record'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Year, header, description, optional status chip, and PDF. Appears in the Also on record ledger.
          {editingId ? ' Leave PDF empty to keep the current file.' : ''}
        </p>
        {msg && (
          <div
            className={`admin-alert ${
              msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('required')
                ? 'admin-alert--error'
                : 'admin-alert--success'
            }`}
          >
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Year
            <input
              required
              placeholder="2025"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </label>
          <label>
            Header
            <input
              required
              placeholder="Tribunal · Vrindavan"
              value={form.header}
              onChange={(e) => setForm({ ...form, header: e.target.value })}
            />
          </label>
          <label>
            Description
            <AdminRichHint />
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Status chip
            <input
              placeholder="Paid in full"
              value={form.statusChip}
              onChange={(e) => setForm({ ...form, statusChip: e.target.value })}
            />
          </label>
          <label>
            PDF {editingId ? '(leave empty to keep current)' : ''}
            <input
              type="file"
              accept="application/pdf,.pdf"
              required={!editingId}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
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
              {editingId ? 'Save changes' : 'Upload record'}
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
        <h2>Also on record ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Header</th>
                <th>Chip</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.year}</td>
                  <td>{item.header}</td>
                  <td>{item.statusChip || '—'}</td>
                  <td>{item.file ? 'Yes' : '—'}</td>
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
                          await api.delete(`/also-on-record/${item.id}`);
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
