import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../data/navigation';
import NavDropdown from './NavDropdown';
import SocialLinks from './SocialLinks';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">RK</span>
          <span className="brand-text">
            <strong>RKLAF</strong>
            <small>Legal Aid Foundation</small>
          </span>
        </Link>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <div className="nav-links">
            {navItems.map((item) => (
              <NavDropdown key={item.label} item={item} onNavigate={() => setMenuOpen(false)} />
            ))}
          </div>
          <div className="nav-mobile-footer">
            <SocialLinks className="nav-social nav-social--mobile" />
            <Link to="/donate" className="btn btn-donate btn-donate--mobile" onClick={() => setMenuOpen(false)}>
              Donate
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <SocialLinks className="nav-social nav-social--desktop" />
          <Link to="/donate" className="btn btn-donate header-donate">
            Donate
          </Link>
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? 'is-active' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
