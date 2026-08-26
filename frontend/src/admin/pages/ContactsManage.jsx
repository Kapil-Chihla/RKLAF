import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const SOURCE_LABELS = {
  contact: 'Contact Us',
  'know-your-rights': 'Know Your Rights',
  donate: 'Donate',
  general: 'General',
};

export default function ContactsManage() {
  const { canDelete } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('all');
  
  const load = () => {
    const q = filter === 'unread' ? '?unread=true' : '';
    return api
      .get(`/contact${q}`)
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const markRead = async (id, read = true) => {
    setMsg('');
    try {
      await api.patch(`/contact/${id}`, { read });
      setMsg(read ? 'Marked as read.' : 'Marked as unread.');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const remove = async (id) => {
    if (!canDelete || !confirm('Delete this message?')) return;
    setMsg('');
    try {
      await api.delete(`/contact/${id}`);
      setMsg('Message deleted.');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Contact inbox</h2>
        <p style={{ color: '#5a6f82', marginTop: 0 }}>
          Messages from Contact, Know Your Rights, and Donate forms. Mark as read or delete.
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
        <label style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.35rem', maxWidth: 220 }}>
          Filter
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All messages</option>
            <option value="unread">Unread only</option>
          </select>
        </label>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>
          Messages ({items.length})
          {filter === 'unread' ? ' — unread' : ''}
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ color: '#5a6f82' }}>
                    No messages{filter === 'unread' ? ' unread' : ''}.
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id} style={c.read ? undefined : { background: 'rgba(196, 177, 154, 0.18)' }}>
                    <td>{c.read ? 'Read' : 'Unread'}</td>
                    <td>{c.name}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{SOURCE_LABELS[c.source] || c.source || '—'}</td>
                    <td style={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{c.message}</td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {c.read ? (
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => markRead(c.id, false)}>
                          Mark unread
                        </button>
                      ) : (
                        <button type="button" className="admin-btn" onClick={() => markRead(c.id, true)}>
                          Mark read
                        </button>
                      )}
                      {canDelete ? (
                        <button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(c.id)}>
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
