import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import DonateSticky from './DonateSticky';
import WhatsAppFloating from './WhatsAppFloating';
import useAutoReveal from '../../hooks/useAutoReveal';

export default function Layout() {
  useAutoReveal();

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
