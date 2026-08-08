import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Our Work & Impact',
    items: [
      { to: '/admin/programmes', label: 'Programmes & Initiatives' },
      { to: '/admin/running-now', label: 'Running now' },
      { to: '/admin/told-in-full', label: 'Told in full' },
      { to: '/admin/success-stories', label: 'Argued in full' },
      { to: '/admin/also-on-record', label: 'Also on record' },
      { to: '/admin/press-mentions', label: 'Press mentions' },
      { to: '/admin/reports', label: 'Annual reports' },
    ],
  },
  {
    label: 'Know Your Rights',
    items: [
      { to: '/admin/articles', label: 'Practical guides (PDF)' },
      { to: '/admin/rights-decks', label: 'Guide decks' },
      { to: '/admin/explainer-videos', label: 'Explainer videos' },
    ],
  },
  {
    label: 'Library',
    items: [{ to: '/admin/library-podcasts', label: 'Audio & video podcasts' }],
  },
  {
    label: 'Academics',
    items: [
      { to: '/admin/blogs', label: 'Blogs & experiences' },
      { to: '/admin/papers', label: 'Research & white papers' },
    ],
  },
  {
    label: 'Inbox',
    items: [{ to: '/admin/contacts', label: 'Contact inbox' }],
  },
];

export default function AdminSidebar({ open, onClose }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    onClose?.();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {open ? <button type="button" className="admin-sidebar-backdrop" aria-label="Close menu" onClick={onClose} /> : null}
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`} aria-label="Admin content sections">
        <div className="admin-sidebar__brand">
          <Link to="/admin/dashboard" onClick={onClose}>
            RKLAF Admin
            <span>Content management</span>
          </Link>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="admin-sidebar__group">
              <p className="admin-sidebar__group-label">{group.label}</p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'is-active' : '')}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
          <div className="admin-sidebar__group">
            <p className="admin-sidebar__group-label">Team</p>
            <NavLink
              to="/admin/team"
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={onClose}
            >
              Team profiles
            </NavLink>
            {isSuperAdmin ? (
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? 'is-active' : '')}
                onClick={onClose}
              >
                Team access & invites
              </NavLink>
            ) : null}
          </div>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <strong>{user?.name}</strong>
            <span className="admin-role-badge">{user?.role?.replace('_', ' ')}</span>
          </div>
          <button type="button" className="admin-btn admin-btn--ghost admin-btn--logout" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminTopBar({ onMenu, menuOpen }) {
  return (
    <header className="admin-topbar">
      <button
        type="button"
        className={`admin-menu-toggle${menuOpen ? ' is-open' : ''}`}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen ? 'true' : 'false'}
        onClick={onMenu}
      >
        <span />
        <span />
        <span />
      </button>
      <p className="admin-topbar__title">Upload & manage site content</p>
      <Link to="/" className="admin-topbar__site" target="_blank" rel="noreferrer">
        <span className="admin-topbar__site-full">View site →</span>
        <span className="admin-topbar__site-short" aria-hidden="true">Site</span>
      </Link>
    </header>
  );
}
