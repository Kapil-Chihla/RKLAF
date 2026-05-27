import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import '../Admin.css';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="admin-auth-page">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <AdminHeader />
      <main className="admin-main">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
}
