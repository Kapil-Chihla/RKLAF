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
        <p>Sign in to upload Desk stories, success stories, KYR guides, blogs, and papers.</p>
        <div className="admin-alert admin-alert--success" style={{ fontSize: '0.9rem' }}>
          <strong>Test login</strong>
          <br />
          Email: <code>admin@rklaf.test</code>
          <br />
          Password: <code>Admin@12345</code>
          <br />
          <span style={{ opacity: 0.85 }}>(seeded when the backend starts)</span>
        </div>
        {needsSetup && (
          <p>
            Or first-time setup: <Link to="/admin/setup">Create super admin account</Link>
          </p>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rklaf.test"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin@12345"
            />
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
