import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavDropdown({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive =
    item.path === '/'
      ? location.pathname === '/'
      : item.path === '/about'
        ? location.pathname.startsWith('/about')
        : item.path === '/our-work'
          ? location.pathname.startsWith('/our-work') || location.pathname.startsWith('/desk')
          : item.path === '/know-your-rights'
            ? location.pathname.startsWith('/know-your-rights')
            : item.path === '/impact'
              ? location.pathname.startsWith('/impact')
              : item.path === '/library'
                ? location.pathname.startsWith('/library')
                : item.path === '/academics'
                  ? location.pathname.startsWith('/academics')
                  : item.path === '/contact'
                    ? location.pathname.startsWith('/contact')
                    : item.path === '/join-us'
                      ? location.pathname.startsWith('/join-us')
                      : Boolean(
                          item.children?.some(
                            (child) => child.path.startsWith('/') && !child.path.includes('#') && location.pathname === child.path,
                          ),
                        );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  if (!item.children) {
    const linkActive =
      item.path === '/'
        ? location.pathname === '/'
        : item.path.startsWith('/') && !item.path.includes('#')
          ? location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
          : false;

    return (
      <Link
        to={item.path}
        className={`nav-link ${linkActive ? 'active' : ''}`}
        onClick={onNavigate}
      >
        <span className="nav-label nav-label--full">{item.label}</span>
        {item.shortLabel && (
          <span className="nav-label nav-label--short">{item.shortLabel}</span>
        )}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={`nav-dropdown ${open ? 'open' : ''} ${isActive ? 'active' : ''}`}
      onMouseEnter={() => {
        if (window.matchMedia('(min-width: 993px)').matches) setOpen(true);
      }}
      onMouseLeave={() => {
        if (window.matchMedia('(min-width: 993px)').matches) setOpen(false);
      }}
    >
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-label nav-label--full">{item.label}</span>
        {item.shortLabel && (
          <span className="nav-label nav-label--short">{item.shortLabel}</span>
        )}
        <span className="chevron" aria-hidden="true" />
      </button>
      <div className="nav-dropdown-menu">
        {item.children.map((child) => (
          <Link
            key={child.path}
            to={child.path}
            className={location.pathname === child.path ? 'active' : ''}
            onClick={close}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
