import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import OurWork from './pages/OurWork';
import DeskStoryDetail from './pages/DeskStoryDetail';
import KnowYourRights from './pages/KnowYourRights';
import Academics from './pages/Academics';
import AcademicPostDetail from './pages/AcademicPostDetail';
import Library from './pages/Library';
import Impact from './pages/Impact';
import SuccessStoryDetail from './pages/SuccessStoryDetail';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

/**
 * Clean-slate routing: redesigned pages + CMS detail routes.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="our-work" element={<OurWork />} />
          <Route path="our-work/desk/:slug" element={<DeskStoryDetail />} />
          <Route path="know-your-rights" element={<KnowYourRights />} />
          <Route path="impact" element={<Impact />} />
          <Route path="impact/stories/:slug" element={<SuccessStoryDetail />} />
          <Route path="library" element={<Library />} />
          <Route path="academics" element={<Academics />} />
          <Route path="academics/post/:slug" element={<AcademicPostDetail />} />
          <Route path="join-us" element={<JoinUs />} />
          <Route path="donate" element={<Donate />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
