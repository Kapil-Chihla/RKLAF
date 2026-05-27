import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AdminLayout from './layout/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import SetupSuperAdmin from './pages/SetupSuperAdmin';
import Dashboard from './pages/Dashboard';
import BlogsManage from './pages/BlogsManage';
import CasesManage from './pages/CasesManage';
import CampsManage from './pages/CampsManage';
import ArticlesManage from './pages/ArticlesManage';
import MapLocationsManage from './pages/MapLocationsManage';
import UsersManage from './pages/UsersManage';

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="setup" element={<SetupSuperAdmin />} />
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="blogs" element={<BlogsManage />} />
          <Route path="cases" element={<CasesManage />} />
          <Route path="camps" element={<CampsManage />} />
          <Route path="articles" element={<ArticlesManage />} />
          <Route path="map" element={<MapLocationsManage />} />
          <Route path="users" element={<UsersManage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
