import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminExistingMedia from '../components/AdminExistingMedia';
import AdminRichHint from '../components/AdminRichHint';

const emptyForm = {
  title: '',
  tag: '',
  caption: '',
  problem: '',
  action: '',
  result: '',
  sortOrder: '0',
  newDocTitle: '',
  newDocDescription: '',
};

export default function ToldInFullManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [documents, setDocuments] = useState([]);
  const [keptDocuments, setKeptDocuments] = useState([]);
  const [editing, setEditing] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/told-in-full?all=true').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setDocuments([]);
    setKeptDocuments([]);
    setEditing(null);
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
      newDocTitle: '',
      newDocDescription: '',
    });
    setDocuments([]);
    setKeptDocuments(item.documents || []);
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
    ['title', 'tag', 'caption', 'problem', 'action', 'result', 'sortOrder'].forEach((k) => {
      if (form[k] !== '') fd.append(k, form[k]);
    });

    documents.forEach((f) => fd.append('documents', f));
    if (documents.length) {
      const meta = documents.map((file, index) => ({
        title:
          index === 0 && form.newDocTitle.trim()
            ? form.newDocTitle.trim()
            : file.name.replace(/\.pdf$/i, ''),
        description: index === 0 ? form.newDocDescription.trim() : '',
      }));
      fd.append('documentsMeta', JSON.stringify(meta));
    }

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
          Prison programme stories (problem / action / result). No photos — attach multiple PDFs for the
          detail page (same pattern as Programmes &amp; Initiatives).
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
            Subtitle (optional)
            <input
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Short line under the title on the detail page"
            />
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

          {editing ? (
            <AdminExistingMedia
              title="Current PDF documents"
              kind="document"
              items={keptDocuments}
              onRemove={(id) => setKeptDocuments((prev) => prev.filter((doc) => (doc.id || doc.url) !== id))}
              onChangeItem={patchKeptDocument}
            />
          ) : null}

          <label>
            PDF documents — select multiple
            <input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={(e) => setDocuments(Array.from(e.target.files || []))}
            />
          </label>
          <label>
            Title for first new PDF (optional)
            <input
              value={form.newDocTitle}
              onChange={(e) => setForm({ ...form, newDocTitle: e.target.value })}
            />
          </label>
          <label>
            Description for first new PDF (optional)
            <textarea
              rows={2}
              value={form.newDocDescription}
              onChange={(e) => setForm({ ...form, newDocDescription: e.target.value })}
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
