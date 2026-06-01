import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import DonateSticky from './DonateSticky';
import WhatsAppFloating from './WhatsAppFloating';

export default function Layout() {
  return (
    <div className="site-wrapper">
      <ScrollToTop />
      <DonateSticky />
      <WhatsAppFloating />
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
