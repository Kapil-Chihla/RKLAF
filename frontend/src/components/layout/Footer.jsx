import { Link } from 'react-router-dom';
import {
  navItems,
  socialLinks,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  OFFICE_DELHI,
  OFFICE_IMPHAL,
} from '../../data/navigation';
import Brand from './Brand';
import SocialIcon from '../icons/SocialIcons';

function FooterNavLink({ item }) {
  if (item.children?.length) {
    return (
      <li>
        <a href={item.path}>{item.label}</a>
        <ul className="footer-v2__sub">
          {item.children.map((child) => (
            <li key={child.path + child.label}>
              <a href={child.path}>{child.label}</a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  if (item.path === '/') {
    return (
      <li>
        <Link to="/">{item.label}</Link>
      </li>
    );
  }

  if (item.path.startsWith('/') && !item.path.includes('#')) {
    return (
      <li>
        <Link to={item.path}>{item.label}</Link>
      </li>
    );
  }

  return (
    <li>
      <a href={item.path}>{item.label}</a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer site-footer--v2">
      <div className="container footer-v2">
        <div className="footer-v2__brand">
          <Brand variant="footer" />
          <p className="footer-v2__tagline">With You. For You. Nyaya Tak.</p>
          <p className="footer-v2__blurb">
            Since 2016, RKLAF has worked to provide free legal aid and assistance, make legal knowledge
            accessible, and bring access to justice within the reach of those who need it.
          </p>
          <div className="footer-v2__social" aria-label="Social links">
            {socialLinks.map((link) => (
              <a
                key={link.icon}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="footer-v2__social-btn"
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-v2__col">
          <h4>Explore</h4>
          <ul>
            {navItems.map((item) => (
              <FooterNavLink key={item.label} item={item} />
            ))}
          </ul>
        </div>

        <div className="footer-v2__col">
          <h4>Get involved</h4>
          <ul>
            <li><Link to="/our-work">Our Work</Link></li>
            <li><Link to="/our-work/reports">Annual reports</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/join-us">Volunteer &amp; intern</Link></li>
            <li><Link to="/join-us#member">Membership</Link></li>
          </ul>
        </div>

        <div className="footer-v2__col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/legal/privacy">Privacy</Link></li>
            <li><Link to="/legal/terms">Terms &amp; conditions</Link></li>
            <li><Link to="/legal/refund">Refund and cancellation policy</Link></li>
            <li><Link to="/legal/disclaimer">Disclaimer</Link></li>
            <li><Link to="/our-work/reports">Public ledger</Link></li>
          </ul>
        </div>

        <div className="footer-v2__col footer-v2__col--contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <span className="footer-v2__label">WhatsApp</span>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a>
            </li>
            <li>
              <span className="footer-v2__label">Email</span>
              <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <span className="footer-v2__label">Head office</span>
              <a href={OFFICE_DELHI.mapsUrl} target="_blank" rel="noopener noreferrer">
                {OFFICE_DELHI.short}
                <small>Open map</small>
              </a>
            </li>
            <li>
              <span className="footer-v2__label">Branch office — Imphal</span>
              <span className="footer-v2__address">
                {OFFICE_IMPHAL.lines.join(', ')}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-v2__bottom">
        <div className="container footer-v2__bottom-inner">
          <p>© {new Date().getFullYear()} · Registered charitable trust · 80G certified</p>
        </div>
      </div>
    </footer>
  );
}
