import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function ReportsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    year: '',
    summary: 'Impact, audited financials & ledger',
  });
  const [file, setFile] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/reports?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('title', form.title || `Annual Report ${form.year}`);
    fd.append('year', form.year);
    fd.append('summary', form.summary);
    if (file) fd.append('file', file);
    try {
      await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Annual report uploaded. The public page shows the latest 2 years.');
      setForm({ title: '', year: '', summary: 'Impact, audited financials & ledger' });
      setFile(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Our Work — annual reports</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Upload year + PDF. The Our Work page always shows the <strong>latest 2 years</strong> only.
        </p>
        {msg && (
          <div className={`admin-alert ${msg.includes('fail') ? 'admin-alert--error' : 'admin-alert--success'}`}>
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
            PDF
            <input type="file" accept=".pdf" required onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">
            Upload annual report
          </button>
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
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.year}</td>
                  <td>{r.title}</td>
                  <td>{r.file ? 'Yes' : '—'}</td>
                  {canDelete && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={async () => {
                          if (!confirm('Delete this report?')) return;
                          await api.delete(`/reports/${r.id}`);
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
