import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import PaymentGateway from './pages/PaymentGateway';
import {
  AboutPage,
  HeritagePage,
  TeamPage,
  ProgramsPage,
  JoinPage,
  KnowYourRightsPage,
  MediaCoveragePage,
  AnnualReportsPage,
  PolicyReportsPage,
} from './pages/RklafPages';
import ImpactMapPage from './pages/ImpactMapPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route element={<Layout />}>
          <Route index element={<Home />} />

          {/* About Us */}
          <Route path="about" element={<AboutPage />} />
          <Route path="about/heritage" element={<HeritagePage />} />
          <Route path="about/team" element={<TeamPage />} />

          {/* Our Work */}
          <Route path="our-work/programs" element={<ProgramsPage />} />
          <Route path="our-work/impact" element={<ImpactMapPage />} />
          <Route path="our-work/annual-reports" element={<AnnualReportsPage />} />
          <Route path="our-work/policy-reports" element={<PolicyReportsPage />} />

          {/* Know Your Rights — single page */}
          <Route path="know-your-rights" element={<KnowYourRightsPage />} />

          {/* Get involved & resources */}
          <Route path="join" element={<JoinPage />} />
          <Route path="media" element={<MediaCoveragePage />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<PaymentGateway />} />
          <Route path="payment-gateway" element={<Navigate to="/donate" replace />} />

          {/* Legacy URL redirects */}
          <Route path="our-story/about-us" element={<Navigate to="/about" replace />} />
          <Route path="our-story/vision" element={<Navigate to="/about" replace />} />
          <Route path="our-story/inspiration" element={<Navigate to="/about/heritage" replace />} />
          <Route path="our-story/our-team" element={<Navigate to="/about/team" replace />} />
          <Route path="about/future-roadmap" element={<Navigate to="/about" replace />} />
          <Route path="our-work/our-cases" element={<Navigate to="/our-work/impact" replace />} />
          <Route path="our-work/our-camps" element={<Navigate to="/our-work/programs" replace />} />
          <Route path="our-work/gallery" element={<Navigate to="/our-work/programs#gallery" replace />} />
          <Route path="our-work/areas-covered" element={<Navigate to="/our-work/impact" replace />} />
          <Route path="our-work/areas-dealing-in" element={<Navigate to="/our-work/impact" replace />} />
          <Route path="our-work/achievements" element={<Navigate to="/our-work/impact" replace />} />
          <Route path="our-work/annual-report" element={<Navigate to="/our-work/annual-reports" replace />} />
          <Route path="know-your-rights/intake" element={<Navigate to="/know-your-rights#intake" replace />} />
          <Route path="noted-judgments" element={<Navigate to="/know-your-rights#noted-judgments" replace />} />
          <Route path="knowledge-hub/articles-research" element={<Navigate to="/blogs" replace />} />
          <Route path="knowledge-hub/emergency-contacts" element={<Navigate to="/contact" replace />} />
          <Route path="knowledge-hub/faqs" element={<Navigate to="/know-your-rights#faqs" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
