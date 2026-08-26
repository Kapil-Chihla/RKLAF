import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

/** Always use the current site host so production invites are never localhost */
function siteInviteLink(tokenOrLink) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  let token = tokenOrLink || '';
  try {
    if (token.includes('token=')) {
      token = new URL(token, origin || 'http://localhost').searchParams.get('token') || '';
    }
  } catch {
    /* keep as-is */
  }
  return `${origin}/admin/register?token=${token}`;
}

export default function UsersManage() {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'admin' });
  const [lastInvite, setLastInvite] = useState('');
  const [msg, setMsg] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const load = () => {
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {});
    api.get('/invites').then((r) => {
      setInvites(
        (r.data || []).map((i) => ({
          ...i,
          inviteLink: siteInviteLink(i.token || i.inviteLink),
        }))
      );
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  if (!isSuperAdmin) return <Navigate to="/admin/dashboard" replace />;

  const sendInvite = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await api.post('/invites', inviteForm);
      setLastInvite(siteInviteLink(data.token || data.inviteLink));
      setMsg('Invite created. Copy the link and send it to your team member.');
      setInviteForm({ email: '', role: 'admin' });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create invite');
    }
  };

  const updateUser = async (id, patch) => {
    await api.patch(`/users/${id}`, patch);
    load();
  };

  const copyLink = async (id, link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch {
      setMsg('Could not copy — select the link manually.');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Invite team member</h2>
        <p style={{ color: '#5a6f82', fontSize: '0.9rem' }}>
          Only you (super admin) control who can open the admin panel. Invite someone by email →
          copy the link → they register with their own password. Invited people can <strong>upload and edit</strong> content;
          they <strong>cannot delete</strong> anything or invite others.
        </p>
        {msg && <div className="admin-alert admin-alert--success">{msg}</div>}
        {lastInvite && (
          <div>
            <strong>Invite link (copy & share):</strong>
            <div className="admin-invite-link">{lastInvite}</div>
          </div>
        )}
        <form className="admin-form" onSubmit={sendInvite} style={{ marginTop: '1rem' }}>
          <label>
            Employee email
            <input type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} />
          </label>
          <label>
            Role
            <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}>
              <option value="admin">Admin — upload &amp; edit (no delete)</option>
              <option value="editor">Editor — upload &amp; edit (no delete)</option>
            </select>
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">Generate invite link</button>
        </form>
        <p style={{ color: '#5a6f82', fontSize: '0.85rem', marginTop: '0.75rem' }}>
          Admin and Editor both manage content the same way. Delete and team invites stay with the super admin only.
        </p>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Team members</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    {u.role !== 'super_admin' && (
                      <div className="admin-table-actions">
                        <select
                          value={u.role}
                          onChange={(e) => updateUser(u.id, { role: e.target.value })}
                          aria-label={`Role for ${u.name}`}
                        >
                          <option value="editor">editor</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          onClick={() => updateUser(u.id, { status: u.status === 'active' ? 'disabled' : 'active' })}
                        >
                          {u.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Pending invites</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Role</th><th>Expires</th><th>Link</th></tr></thead>
            <tbody>
              {invites.filter((i) => i.status === 'pending').map((i) => (
                <tr key={i.id}>
                  <td>{i.email}</td>
                  <td>{i.role}</td>
                  <td>{new Date(i.expiresAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-invite-cell">
                      <span className="admin-invite-cell__link" title={i.inviteLink}>{i.inviteLink}</span>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => copyLink(i.id, i.inviteLink)}
                      >
                        {copiedId === i.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
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
