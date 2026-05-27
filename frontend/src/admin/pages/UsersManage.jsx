import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function UsersManage() {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'editor' });
  const [lastInvite, setLastInvite] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {});
    api.get('/invites').then((r) => setInvites(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  if (!isSuperAdmin) return <Navigate to="/admin/dashboard" replace />;

  const sendInvite = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await api.post('/invites', inviteForm);
      setLastInvite(data.inviteLink);
      setMsg('Invite created. Copy the link and send it to your team member.');
      setInviteForm({ email: '', role: 'editor' });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create invite');
    }
  };

  const updateUser = async (id, patch) => {
    await api.patch(`/users/${id}`, patch);
    load();
  };

  return (
    <div>
      <div className="admin-card">
        <h2>Invite team member</h2>
        <p style={{ color: '#5a6f82', fontSize: '0.9rem' }}>
          Same flow used by most organizations: super admin sends an invite link → employee registers
          with their own password → role controls what they can do.
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
              <option value="editor">Editor — upload content only</option>
              <option value="admin">Admin — upload + delete content</option>
            </select>
          </label>
          <button type="submit" className="admin-btn admin-btn--primary">Generate invite link</button>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Team members</h2>
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
                    <>
                      <select
                        value={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value })}
                        style={{ marginRight: '0.5rem' }}
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
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Pending invites</h2>
        <table className="admin-table">
          <thead><tr><th>Email</th><th>Role</th><th>Expires</th><th>Link</th></tr></thead>
          <tbody>
            {invites.filter((i) => i.status === 'pending').map((i) => (
              <tr key={i.id}>
                <td>{i.email}</td>
                <td>{i.role}</td>
                <td>{new Date(i.expiresAt).toLocaleDateString()}</td>
                <td style={{ fontSize: '0.75rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{i.inviteLink}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
