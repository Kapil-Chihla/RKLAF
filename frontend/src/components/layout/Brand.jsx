import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

export default function Brand({ variant = 'header', onNavigate }) {
  const isFooter = variant === 'footer';

  return (
    <Link
      to="/"
      className={`brand ${isFooter ? 'brand--footer' : ''}`}
      onClick={onNavigate}
    >
      <img
        src={logo}
        alt=""
        className="brand-logo"
        width={48}
        height={48}
      />
      <span className="brand-text">
        <strong className="brand-name-line">Radhey Krishna</strong>
        <span className="brand-name-line brand-name-line--sub">Legal Aid Foundation</span>
      </span>
    </Link>
  );
}
