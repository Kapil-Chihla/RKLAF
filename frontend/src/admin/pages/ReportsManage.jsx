import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const emptyForm = {
  title: '',
  year: '',
  summary: 'Impact, audited financials & ledger',
};

export default function ReportsManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const load = () => api.get('/reports?all=true').then((r) => setItems(r.data)).catch(() => {});

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
      title: item.title || '',
      year: item.year || '',
      summary: item.summary || 'Impact, audited financials & ledger',
    });
    setFile(null);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!editingId && !file) {
      setMsg('PDF is required for new reports.');
      return;
    }
    const fd = new FormData();
    fd.append('title', form.title || `Annual Report ${form.year}`);
    fd.append('year', form.year);
    fd.append('summary', form.summary);
    if (file) fd.append('file', file);
    try {
      if (editingId) {
        await api.put(`/reports/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Annual report updated.');
      } else {
        await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('Annual report uploaded. The public page shows the latest 2 years.');
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
        <h2>{editingId ? 'Edit annual report' : 'Our Work — annual reports'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Upload year + PDF. The Our Work page always shows the <strong>latest 2 years</strong> only.
          {editingId ? ' PDF is optional when editing — leave empty to keep the current file.' : ''}
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
              placeholder="2025–26"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </label>
          <label>
            Title (optional)
            <input
              placeholder="Annual Report 2025–26"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label>
            Short description
            <input
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>
          <label>
            PDF {editingId ? '(optional — leave empty to keep current)' : ''}
            <input
              type="file"
              accept="application/pdf,.pdf"
              required={!editingId}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editingId ? 'Save changes' : 'Upload annual report'}
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
        <h2>All reports ({items.length})</h2>
        <p style={{ color: '#5a6f82', fontSize: '0.9rem' }}>
          Public site uses the top two by year. Older uploads stay here for archive.
        </p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.year}</td>
                  <td>{r.title}</td>
                  <td>{r.file ? 'Yes' : '—'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-btn" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this report?')) return;
                          await api.delete(`/reports/${r.id}`);
                          if (editingId === r.id) clearForm();
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
