import { Link } from 'react-router-dom';

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 3h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z" />
    </svg>
  );
}

/** Left-edge vertical tabs from the revised home design */
export default function SideTabs() {
  return (
    <div className="side-tabs notranslate" aria-label="Quick actions" translate="no">
      <Link to="/donate" className="side-tabs__tab side-tabs__tab--donate">
        <span className="side-tabs__icon side-tabs__icon--heart" aria-hidden="true">
          <HeartIcon />
        </span>
        <span className="side-tabs__label">Donate</span>
      </Link>
      <Link to="/contact" className="side-tabs__tab side-tabs__tab--touch">
        <span className="side-tabs__icon" aria-hidden="true">
          <PhoneIcon />
        </span>
        <span className="side-tabs__label">Get In Touch</span>
      </Link>
    </div>
  );
}
