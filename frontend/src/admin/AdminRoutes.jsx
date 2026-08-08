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
import RunningNowManage from './pages/RunningNowManage';
import ToldInFullManage from './pages/ToldInFullManage';
import AlsoOnRecordManage from './pages/AlsoOnRecordManage';
import PressMentionsManage from './pages/PressMentionsManage';
import PapersManage from './pages/PapersManage';
import ExplainerVideosManage from './pages/ExplainerVideosManage';
import RightsDecksManage from './pages/RightsDecksManage';
import LibraryPodcastsManage from './pages/LibraryPodcastsManage';
import ReportsManage from './pages/ReportsManage';
import CampsManage from './pages/CampsManage';
import UsersManage from './pages/UsersManage';
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
          <Route path="running-now" element={<RunningNowManage />} />
          <Route path="told-in-full" element={<ToldInFullManage />} />
          <Route path="also-on-record" element={<AlsoOnRecordManage />} />
          <Route path="press-mentions" element={<PressMentionsManage />} />
          <Route path="camps" element={<CampsManage />} />
          <Route path="reports" element={<ReportsManage />} />
          <Route path="blogs" element={<BlogsManage />} />
          <Route path="papers" element={<PapersManage />} />
          <Route path="articles" element={<ArticlesManage />} />
          <Route path="rights-decks" element={<RightsDecksManage />} />
          <Route path="explainer-videos" element={<ExplainerVideosManage />} />
          <Route path="library-podcasts" element={<LibraryPodcastsManage />} />
          <Route path="team" element={<TeamManage />} />
          <Route path="contacts" element={<ContactsManage />} />
          <Route path="users" element={<UsersManage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
