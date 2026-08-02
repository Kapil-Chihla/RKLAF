import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

export default function Brand({ variant = 'header', onNavigate }) {
  return (
    <Link
      to="/"
      className={`brand brand--${variant} notranslate`}
      onClick={onNavigate}
      translate="no"
      aria-label="Radhey Krishna Legal Aid Foundation — Home"
    >
      <span className="brand-mark">
        <img src={logo} alt="" className="brand-logo" width={52} height={52} />
      </span>
      <span className="brand-text">
        <strong className="brand-name-line">Radhey Krishna</strong>
        <span className="brand-name-line brand-name-line--mid">Legal Aid</span>
        <span className="brand-name-line brand-name-line--sub">Foundation</span>
      </span>
    </Link>
  );
}
