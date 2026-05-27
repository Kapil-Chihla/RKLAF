import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link to="/admin/dashboard" className="admin-brand" onClick={() => setMenuOpen(false)}>
          Legal Aid Admin
          <span>Content Management</span>
        </Link>

        <button
          type="button"
          className={`admin-menu-toggle ${menuOpen ? 'is-active' : ''}`}
          aria-label="Toggle admin menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`admin-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Admin navigation">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMenuOpen(false)}
            >
              Team Access
            </NavLink>
          )}
        </nav>

        <div className="admin-header__user">
          <span className="admin-header__name">{user?.name}</span>
          <span className="admin-role-badge">{user?.role?.replace('_', ' ')}</span>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--logout"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="admin-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
