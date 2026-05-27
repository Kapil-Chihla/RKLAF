import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/cases', label: 'Cases' },
  { to: '/admin/camps', label: 'Camps' },
  { to: '/admin/articles', label: 'Knowledge Hub' },
  { to: '/admin/map', label: 'Impact Map' },
];

export default function AdminHeader() {
  const { user, logout, isSuperAdmin } = useAuth();

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link to="/admin/dashboard" className="admin-brand">
          Legal Aid Admin
          <span>Content Management</span>
        </Link>
        <nav className="admin-nav">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              Team Access
            </NavLink>
          )}
        </nav>
        <div className="admin-header__user">
          <span>{user?.name}</span>
          <span className="admin-role-badge">{user?.role?.replace('_', ' ')}</span>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={logout} style={{ color: '#fbf9f6', borderColor: 'rgba(255,255,255,0.4)' }}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
