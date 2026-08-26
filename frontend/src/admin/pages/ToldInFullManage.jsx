import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminExistingMedia from '../components/AdminExistingMedia';
import AdminNewPdfBatch, { appendNewPdfBatch } from '../components/AdminNewPdfBatch';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  title: '',
  tag: '',
  caption: '',
  caseLine: '',
  problem: '',
  action: '',
  result: '',
  fullBody: '',
  sortOrder: '0',
};

export default function ToldInFullManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [newPdfs, setNewPdfs] = useState([]);
  const [keptDocuments, setKeptDocuments] = useState([]);
  const [editing, setEditing] = useState(null);
  
  const load = () => api.get('/told-in-full?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setNewPdfs([]);
    setKeptDocuments([]);
    setEditing(null);
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      tag: item.tag || '',
      caption: item.caption || '',
      caseLine: item.caseLine || '',
      problem: item.problem || '',
      action: item.action || '',
      result: item.result || '',
      fullBody: item.fullBody || '',
      sortOrder: String(item.sortOrder ?? 0),
    });
    setNewPdfs([]);
    setKeptDocuments(
      (item.documents || []).map((doc) => ({
        ...doc,
        title: doc.title || (doc.name || '').replace(/\.pdf$/i, ''),
      })),
    );
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const patchKeptDocument = (id, patch) => {
    setKeptDocuments((prev) =>
      prev.map((doc) => ((doc.id || doc.url) === id ? { ...doc, ...patch } : doc)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    const fd = new FormData();
    ['title', 'tag', 'caption', 'caseLine', 'problem', 'action', 'result', 'fullBody', 'sortOrder'].forEach(
      (k) => {
        if (form[k] !== '') fd.append(k, form[k]);
      },
    );
    appendNewPdfBatch(fd, newPdfs);

    try {
      if (editing) {
        fd.append('documentsJson', JSON.stringify(keptDocuments));
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
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editing ? 'Edit told in full' : 'Impact — Told in full'}</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Prison programme stories — same story fields as Argued in full (tag, case line, problem / action /
          result, full story text, PDFs). No photos. Set a custom public name for each PDF (shown instead of
          the uploaded filename).
          {editing ? ' Remove or rename existing PDFs below, or add more files.' : ''}
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
            Category tag
            <input
              required
              placeholder="Appeal restored"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          </label>
          <label>
            Subtitle (optional)
            <input
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Short line under the title on the detail page"
            />
          </label>
          <label>
            Case line
            <input
              placeholder="Delhi High Court · Bail · File XXX/2024"
              value={form.caseLine}
              onChange={(e) => setForm({ ...form, caseLine: e.target.value })}
            />
          </label>
          <label>
            Problem
            <AdminRichHint />
            <textarea
              rows={2}
              required
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
            />
          </label>
          <label>
            Action
            <AdminRichHint />
            <textarea
              rows={2}
              required
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
            />
          </label>
          <label>
            Result
            <AdminRichHint />
            <textarea
              rows={2}
              required
              value={form.result}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
            />
          </label>
          <label>
            Full story text
            <AdminRichHint />
            <textarea
              rows={6}
              value={form.fullBody}
              onChange={(e) => setForm({ ...form, fullBody: e.target.value })}
            />
          </label>

          {editing ? (
            <AdminExistingMedia
              title="Current PDF documents"
              kind="document"
              titleOnly
              items={keptDocuments}
              onChangeItem={patchKeptDocument}
              onRemove={(id) => setKeptDocuments((prev) => prev.filter((doc) => (doc.id || doc.url) !== id))}
            />
          ) : null}

          <AdminNewPdfBatch items={newPdfs} onChange={setNewPdfs} variant="titleOnly" />

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
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm} disabled={busy}>
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
                <th>PDFs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.tag}</td>
                  <td>{item.title}</td>
                  <td>{item.documents?.length || 0}</td>
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
