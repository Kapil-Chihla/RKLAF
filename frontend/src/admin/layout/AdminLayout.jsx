import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AdminSidebar, { AdminTopBar } from './AdminSidebar';
import AdminFooter from './AdminFooter';
import '../Admin.css';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  if (loading) {
    return <div className="admin-auth-page">Loading admin…</div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell admin-shell--sidebar">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="admin-shell__main">
        <AdminTopBar
          menuOpen={menuOpen}
          onMenu={() => setMenuOpen((open) => !open)}
        />
        <main className="admin-main">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
