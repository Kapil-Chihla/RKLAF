import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems, socialLinks } from '../../data/navigation';
import Brand from './Brand';
import NavDropdown from './NavDropdown';
import SocialIcon from '../icons/SocialIcons';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header site-header--v2 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-bar container">
        <Brand variant="header" onNavigate={closeMenu} />

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
            <div className="header-social header-social--mobile" aria-label="Social links">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="header-social__btn"
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </div>
            <div className="nav-mobile-footer__actions">
              <Link to="/contact" className="btn-header-touch" onClick={closeMenu}>
                Get in touch
              </Link>
              <Link to="/donate" className="btn-header-donate" onClick={closeMenu}>
                Donate
              </Link>
            </div>
          </div>
        </nav>

        <div className="header-actions">
          {/* Always visible — including mobile home — so language isn’t buried in the menu */}
          <div className="header-actions__lang">
            <LanguageSwitcher compact />
          </div>
          <div className="header-social header-social--desktop" aria-label="Social links">
            {socialLinks.map((link) => (
              <a
                key={link.icon}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="header-social__btn"
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>

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
