import SocialIcon from '../icons/SocialIcons';
import { socialLinks } from '../../data/navigation';

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`social-links ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.icon}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className="social-link"
        >
          <SocialIcon name={link.icon} />
        </a>
      ))}
    </div>
  );
}
