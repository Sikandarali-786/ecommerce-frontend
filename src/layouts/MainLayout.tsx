import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollRestoration from '../components/ScrollRestoration';
import FirstTimePopup from '../components/FirstTimePopup';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '923048405899';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I want to place an order from Afzal Bikerz Store.')}`;

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
      <FirstTimePopup />

      {/* ── Floating WhatsApp Button ─────────────────────────────────────── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl hover:bg-[#1ebe5d] transition-all hover:scale-105 active:scale-95"
        style={{ boxShadow: '0 4px 24px rgba(37,211,102,0.45)' }}
      >
        <FaWhatsapp className="w-6 h-6 shrink-0" />
        <span className="text-sm font-bold tracking-wide pr-1">Chat Now</span>
      </a>
    </div>
  );
};

export default MainLayout;

