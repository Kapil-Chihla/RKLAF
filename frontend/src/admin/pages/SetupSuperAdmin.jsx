import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../Admin.css';

export default function SetupSuperAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    api.get('/auth/setup-status')
      .then((r) => {
        if (!r.data.needsSetup) navigate('/admin/login');
        else setAllowed(true);
      })
      .catch(() => setAllowed(true));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/setup-super-admin', form);
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    }
  };

  if (!allowed) return null;

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <h1>Create Super Admin</h1>
        <p>
          One super admin account controls the organization — inviting employees,
          assigning roles, and managing team access (same model as Slack, Notion, or Google Workspace).
        </p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Password
            <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error && <div className="admin-alert admin-alert--error">{error}</div>}
          <button type="submit" className="admin-btn admin-btn--primary">Create account</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          Already set up? <Link to="/admin/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
