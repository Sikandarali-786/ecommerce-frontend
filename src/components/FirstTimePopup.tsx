import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiX, FiGift, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import giftImg from '../assets/images/gift_offer.png';
import { getUser } from '../utils/auth';

const FirstTimePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't show popup while user is still on auth pages
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    const currentUser = getUser();
    const isNewRegistration = localStorage.getItem('justRegisteredUser') === 'true';

    // Popup is for logged-in users who haven't seen the gift offer yet
    if (!currentUser) return;

    const userKey = `hasSeenGiftOffer_${currentUser._id || currentUser.id || currentUser.email}`;
    const hasSeen = localStorage.getItem(userKey) === 'true';

    // Show popup if new registration login OR if this user account hasn't seen it yet
    if (isNewRegistration || !hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleClose = () => {
    const currentUser = getUser();
    if (currentUser) {
      const userKey = `hasSeenGiftOffer_${currentUser._id || currentUser.id || currentUser.email}`;
      localStorage.setItem(userKey, 'true');
    }
    localStorage.removeItem('justRegisteredUser');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-white/20 shadow-2xl transition-all scale-100"
        style={{ animation: 'popupScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/20 transition-all hover:scale-110"
          aria-label="Close promotion modal"
        >
          <FiX size={20} />
        </button>

        {/* Promo Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img 
            src={giftImg} 
            alt="Exclusive Motorcycle Gift Offer" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-extrabold text-xs uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
            <FiGift size={14} />
            Exclusive Welcome Deal
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 text-center text-white flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white leading-tight mb-2">
            First 50 Customers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
              Get Special Gifts! 🎁
            </span>
          </h2>

          <p className="text-sm text-zinc-300 mb-5 leading-relaxed max-w-md">
            Order your favorite bike accessories today and receive an <strong className="text-white">exclusive complimentary gift</strong> packed with your delivery!
          </p>

          {/* Offer Highlights */}
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-6 flex items-center justify-around text-xs sm:text-sm font-semibold text-zinc-200">
            <div className="flex items-center gap-1.5 text-amber-400">
              <FiCheckCircle size={16} />
              <span>Free Gift Box</span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="flex items-center gap-1.5 text-red-400">
              <FiCheckCircle size={16} />
              <span>Only 14 Left!</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <Link
              to="/products"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FiShoppingBag size={18} />
              Claim My Gift & Shop Now
            </Link>

            <button
              onClick={handleClose}
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors py-1"
            >
              No thanks, I'll explore later
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popupScale {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FirstTimePopup;
