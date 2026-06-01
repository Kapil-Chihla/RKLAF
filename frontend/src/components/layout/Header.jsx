import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../data/navigation';
import Brand from './Brand';
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-bar container">
        <Brand variant="header" compact onNavigate={closeMenu} />

        <nav
          id="main-navigation"
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <div className="nav-links">
            {navItems.map((item) => (
              <NavDropdown key={item.label} item={item} onNavigate={closeMenu} />
            ))}
          </div>
          <div className="nav-mobile-footer">
            <SocialLinks className="nav-social nav-social--mobile" />
            <Link to="/donate" className="btn btn-donate btn-donate--mobile" onClick={closeMenu}>
              Donate
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/donate" className="btn btn-donate header-donate">
            Donate
          </Link>
          <SocialLinks className="nav-social nav-social--desktop" />
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? 'is-active' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
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
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
