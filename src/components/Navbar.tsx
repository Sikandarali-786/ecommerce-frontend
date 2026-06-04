import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingCart, FiLogOut, FiMenu, FiX, FiHeart,
  FiPackage, FiChevronDown, FiSettings,
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { isAuthenticated, isAdmin, logout, getUser } from '../utils/auth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const user = getUser();

  // Cart item count badge
  const { data: cartData } = useCart();
  const cartCount = cartData?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:rounded-full after:transition-all ${
      isActive(path)
        ? 'text-indigo-600 after:w-full after:bg-indigo-600'
        : 'text-slate-600 hover:text-indigo-600 after:w-0 hover:after:w-full after:bg-indigo-600'
    }`;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="text-white" size={16} />
            </div>
            <span className="text-xl font-800 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/products" className={navLinkClass('/products')}>Products</Link>
            {authenticated && (
              <>
                <Link to="/orders" className={navLinkClass('/orders')}>Orders</Link>
              </>
            )}
          </div>

          {/* ── Desktop actions ───────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {authenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  title="Wishlist"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/wishlist')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <FiHeart size={20} />
                </Link>

                {/* Cart with badge */}
                <Link
                  to="/cart"
                  title="Cart"
                  className={`relative p-2 rounded-lg transition-colors ${
                    isActive('/cart')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-indigo-600 text-white text-[10px] font-700 rounded-full flex items-center justify-center px-1 leading-none">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* Admin link */}
                {admin && (
                  <Link
                    to="/admin"
                    title="Admin Panel"
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                  >
                    <MdAdminPanelSettings size={22} />
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
                      {initials}
                    </div>
                    <span className="text-sm font-600 text-slate-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <FiChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-600 text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FiPackage size={15} />
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FiSettings size={15} />
                        Account Settings
                      </Link>
                      {admin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <MdAdminPanelSettings size={15} />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-600 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-600 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: cart badge + menu toggle ─────────────── */}
          <div className="md:hidden flex items-center gap-2">
            {authenticated && (
              <Link to="/cart" className="relative p-2 text-slate-600">
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-indigo-600 text-white text-[9px] font-700 rounded-full flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileOpen(v => !v)}
              className="p-2 text-slate-600 hover:text-indigo-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────────── */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1">
            <MobileLink to="/" label="Home" icon={<FiShoppingCart size={17} />} active={isActive('/')} />
            <MobileLink to="/products" label="Products" icon={<FiPackage size={17} />} active={isActive('/products')} />

            {authenticated ? (
              <>
                <MobileLink to="/wishlist" label="Wishlist" icon={<FiHeart size={17} />} active={isActive('/wishlist')} />
                <MobileLink to="/orders" label="My Orders" icon={<FiPackage size={17} />} active={isActive('/orders')} />
                {admin && (
                  <MobileLink to="/admin" label="Admin Panel" icon={<MdAdminPanelSettings size={17} />} active={isActive('/admin')} />
                )}
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-700">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-600 text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-500"
                  >
                    <FiLogOut size={17} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-600 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-600 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

// Mobile nav item helper
const MobileLink = ({
  to, label, icon, active,
}: { to: string; label: string; icon: React.ReactNode; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-colors ${
      active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;