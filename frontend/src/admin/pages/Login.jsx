import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import '../Admin.css';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (user) navigate('/admin/dashboard');
    api.get('/auth/setup-status').then((r) => setNeedsSetup(r.data.needsSetup)).catch(() => {});
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <h1>Admin Login</h1>
        <p>Sign in with your organization account. Team access is invite-only.</p>
        {needsSetup && (
          <p>
            First time? <Link to="/admin/setup">Create super admin account</Link>
          </p>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div className="admin-alert admin-alert--error">{error}</div>}
          <button type="submit" className="admin-btn admin-btn--primary">Sign in</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          Have an invite? <Link to="/admin/register">Complete registration</Link>
        </p>
      </div>
    </div>
  );
}
