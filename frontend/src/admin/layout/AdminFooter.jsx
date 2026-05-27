import { Link } from 'react-router-dom';

export default function AdminFooter() {
  return (
    <footer className="admin-footer">
      <p>&copy; {new Date().getFullYear()} Legal Aid Foundation — Admin Panel</p>
      <div>
        <Link to="/" style={{ color: 'rgba(251,249,246,0.85)' }}>View public site</Link>
      </div>
    </footer>
  );
}
