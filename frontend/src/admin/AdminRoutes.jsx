import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AdminLayout from './layout/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import SetupSuperAdmin from './pages/SetupSuperAdmin';
import Dashboard from './pages/Dashboard';
import BlogsManage from './pages/BlogsManage';
import ArticlesManage from './pages/ArticlesManage';
import DeskStoriesManage from './pages/DeskStoriesManage';
import SuccessStoriesManage from './pages/SuccessStoriesManage';
import PapersManage from './pages/PapersManage';
import ExplainerVideosManage from './pages/ExplainerVideosManage';
import ReportsManage from './pages/ReportsManage';
import CampsManage from './pages/CampsManage';
import UsersManage from './pages/UsersManage';
import MapLocationsManage from './pages/MapLocationsManage';
import TeamManage from './pages/TeamManage';
import ContactsManage from './pages/ContactsManage';

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="setup" element={<SetupSuperAdmin />} />
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="desk" element={<DeskStoriesManage />} />
          <Route path="success-stories" element={<SuccessStoriesManage />} />
          <Route path="camps" element={<CampsManage />} />
          <Route path="map-locations" element={<MapLocationsManage />} />
          <Route path="reports" element={<ReportsManage />} />
          <Route path="blogs" element={<BlogsManage />} />
          <Route path="papers" element={<PapersManage />} />
          <Route path="articles" element={<ArticlesManage />} />
          <Route path="explainer-videos" element={<ExplainerVideosManage />} />
          <Route path="team" element={<TeamManage />} />
          <Route path="contacts" element={<ContactsManage />} />
          <Route path="users" element={<UsersManage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
