import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import OurWork from './pages/OurWork';
import KnowYourRights from './pages/KnowYourRights';
import Academics from './pages/Academics';
import Library from './pages/Library';
import Impact from './pages/Impact';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';

/**
 * Clean-slate routing: redesigned pages only.
 * Contact stays at /contact (Get in Touch); Join Us is in main nav.
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
          <Route path="our-work/*" element={<Navigate to="/our-work" replace />} />
          <Route path="know-your-rights" element={<KnowYourRights />} />
          <Route path="know-your-rights/*" element={<Navigate to="/know-your-rights" replace />} />
          <Route path="impact" element={<Impact />} />
          <Route path="impact/*" element={<Navigate to="/impact" replace />} />
          <Route path="library" element={<Library />} />
          <Route path="library/*" element={<Navigate to="/library" replace />} />
          <Route path="academics" element={<Academics />} />
          <Route path="academics/*" element={<Navigate to="/academics" replace />} />
          <Route path="join-us" element={<JoinUs />} />
          <Route path="join-us/*" element={<Navigate to="/join-us" replace />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact/*" element={<Navigate to="/contact" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
