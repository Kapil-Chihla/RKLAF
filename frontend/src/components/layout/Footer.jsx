import { Link } from 'react-router-dom';
import { footerColumns, socialLinks, WHATSAPP_URL } from '../../data/navigation';
import SocialIcon from '../icons/SocialIcons';
import SocialLinks from './SocialLinks';

function FooterColumn({ title, links }) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      <ul>
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="brand brand--footer">
            <span className="brand-mark">RK</span>
            <span className="brand-text">
              <strong>RKLAF</strong>
              <small>Radhey Krishna Legal Aid Foundation</small>
            </span>
          </Link>
          <p>
            With You. For You. Nyaya Tak. Democratizing access to justice for every citizen.
          </p>
          <SocialLinks />
        </div>

        <div className="footer-grid">
          {footerColumns.map((col) => (
            <FooterColumn key={col.title} title={col.title} links={col.links} />
          ))}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/join">Join the Fight for Justice</Link></li>
              <li><Link to="/media">Media Coverage</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
            <h4 className="footer-subheading">Connect</h4>
            <ul className="footer-social-list">
              {socialLinks.map((link) => (
                <li key={link.icon}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <SocialIcon name={link.icon} />
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} Radhey Krishna Legal Aid Foundation. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/contact">Contact</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
