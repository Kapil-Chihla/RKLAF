import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import SideTabs from './SideTabs';
import ContactFloats from './ContactFloats';
import GoogleTranslateHost from './GoogleTranslateHost';
import SiteDisclaimer from './SiteDisclaimer';
import useAutoReveal from '../../hooks/useAutoReveal';

export default function Layout() {
  useAutoReveal();

  return (
    <div className="site-wrapper site-wrapper--v2">
      <ScrollToTop />
      <GoogleTranslateHost />
      <SiteDisclaimer />
      <SideTabs />
      <ContactFloats />
      <div className="site-shell">
        <Header />
        <main className="site-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
