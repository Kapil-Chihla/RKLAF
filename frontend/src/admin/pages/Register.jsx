import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import '../Admin.css';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteToken: searchParams.get('token') || '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) setForm((f) => ({ ...f, inviteToken: token }));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('admin_token', data.token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
        window.location.reload();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <h1>Join as team member</h1>
        <p>
          Use the invite link from your super admin. This is how organizations onboard
          staff without sharing one password.
        </p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Invite token
            <input required value={form.inviteToken} onChange={(e) => setForm({ ...form, inviteToken: e.target.value })} placeholder="From invite email or link" />
          </label>
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
          {success && <div className="admin-alert admin-alert--success">Account created. Redirecting…</div>}
          <button type="submit" className="admin-btn admin-btn--primary">Create account</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          <Link to="/admin/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
