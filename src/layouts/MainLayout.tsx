import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollRestoration from '../components/ScrollRestoration';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <ScrollRestoration />
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
