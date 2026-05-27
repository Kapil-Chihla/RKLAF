import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavDropdown({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = item.children?.some((child) => location.pathname === child.path);

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
    return (
      <Link
        to={item.path}
        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        onClick={onNavigate}
      >
        {item.label}
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
        {item.label}
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
