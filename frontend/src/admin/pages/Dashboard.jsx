import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

const links = [
  { to: '/admin/blogs', label: 'Upload blogs', desc: 'Publish stories and updates' },
  { to: '/admin/cases', label: 'Manage cases', desc: 'Add legal cases to Our Work' },
  { to: '/admin/camps', label: 'Manage camps', desc: 'Add outreach camp records' },
  { to: '/admin/articles', label: 'Knowledge hub', desc: 'Articles and research uploads' },
  { to: '/admin/map', label: 'Impact map', desc: 'Add locations shown on the world map' },
];

export default function Dashboard() {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ color: '#1e3347', marginTop: 0 }}>Dashboard</h1>
      <p style={{ color: '#5a6f82' }}>Manage website content from the panels below.</p>

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat"><strong>{stats.blogs}</strong><span>Blogs</span></div>
          <div className="admin-stat"><strong>{stats.cases}</strong><span>Cases</span></div>
          <div className="admin-stat"><strong>{stats.camps}</strong><span>Camps</span></div>
          <div className="admin-stat"><strong>{stats.articles}</strong><span>Articles</span></div>
          <div className="admin-stat"><strong>{stats.mapLocations ?? 0}</strong><span>Map locations</span></div>
          {isSuperAdmin && (
            <>
              <div className="admin-stat"><strong>{stats.users}</strong><span>Team members</span></div>
              <div className="admin-stat"><strong>{stats.pendingInvites}</strong><span>Pending invites</span></div>
            </>
          )}
        </div>
      )}

      <div className="admin-dashboard-grid">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="admin-card" style={{ display: 'block', textDecoration: 'none' }}>
            <h2 style={{ fontSize: '1.1rem' }}>{item.label}</h2>
            <p style={{ margin: 0, color: '#5a6f82', fontSize: '0.9rem' }}>{item.desc}</p>
          </Link>
        ))}
        {isSuperAdmin && (
          <Link to="/admin/users" className="admin-card" style={{ display: 'block', textDecoration: 'none', borderColor: '#834256' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Team access</h2>
            <p style={{ margin: 0, color: '#5a6f82', fontSize: '0.9rem' }}>Invite employees and assign roles</p>
          </Link>
        )}
      </div>
    </div>
  );
}
