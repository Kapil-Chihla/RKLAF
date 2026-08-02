import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AdminSidebar, { AdminTopBar } from './AdminSidebar';
import AdminFooter from './AdminFooter';
import '../Admin.css';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <AdminTopBar onMenu={() => setMenuOpen(true)} />
        <main className="admin-main">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
