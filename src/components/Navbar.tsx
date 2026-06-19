import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingCart, FiLogOut, FiMenu, FiX, FiHeart,
  FiPackage, FiChevronDown, FiSettings, FiSearch, FiUser,
} from 'react-icons/fi';
import { MdAdminPanelSettings, MdPhone, MdEmail } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { isAuthenticated, isAdmin, logout, getUser } from '../utils/auth';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useCategories';
import logoImg from '../assets/images/logo.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const user = getUser();

  const { data: cartData } = useCart();
  const cartCount = cartData?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  // ── Dynamic categories from backend ──────────────────────────────────────
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories ?? [];

  // Which category slug is currently active (from URL)
  const searchParams = new URLSearchParams(location.search);
  const activeCategorySlug = searchParams.get('category') ?? '';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── Top info bar ──────────────────────────────────────────────── */}
      <div className="bg-[#8B0000] text-white text-xs py-1.5 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              href="tel:03048405899"
              className="flex items-center gap-1.5 hover:text-red-200 transition-colors"
            >
              <MdPhone size={13} />
              <span>03048405899</span>
            </a>
            <a
              href="mailto:rehanqureshi@gmail.com"
              className="flex items-center gap-1.5 hover:text-red-200 transition-colors"
            >
              <MdEmail size={13} />
              <span>rehanqureshi@gmail.com</span>
            </a>
          </div>
          <span className="hidden sm:block text-red-200 text-[11px]">
            Pakistan's #1 Motorcycle Parts Store
          </span>
        </div>
      </div>

      {/* ── Main navbar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">

            {/* ── Logo ──────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center flex-shrink-0 mr-4">
              <img
                src={logoImg}
                alt="Afzal Bikerz Studio"
                className="h-14 w-auto object-contain rounded-sm"
              />
            </Link>

            {/* ── Desktop nav: dynamic categories ───────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide">
              {categories.length === 0 ? (
                // Skeleton placeholders while loading
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-24 bg-slate-100 rounded animate-pulse mx-1.5 flex-shrink-0"
                  />
                ))
              ) : (
                categories.map((cat) => {
                  const isActivecat = activeCategorySlug === cat.slug
                    && location.pathname.startsWith('/products');
                  return (
                    <Link
                      key={cat._id}
                      to={`/products?category=${encodeURIComponent(cat.slug)}`}
                      className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors rounded-md flex-shrink-0 ${
                        isActivecat
                          ? 'text-[#8B0000] bg-red-50'
                          : 'text-slate-700 hover:text-[#8B0000] hover:bg-red-50'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })
              )}
            </div>

            {/* ── Desktop right actions ──────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1 ml-2 flex-shrink-0">

              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="border border-slate-300 rounded-lg text-sm px-3 py-1.5 w-44 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="ml-1 p-1.5 text-slate-400 hover:text-slate-600"
                    >
                      <FiX size={16} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-slate-600 hover:text-[#8B0000] transition-colors rounded-lg hover:bg-red-50"
                    title="Search"
                  >
                    <FiSearch size={20} />
                  </button>
                )}
              </div>

              {/* User / Auth */}
              {authenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B0000] to-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <FiChevronDown
                      size={13}
                      className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                      <div className="px-3 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FiPackage size={15} /> My Orders
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FiSettings size={15} /> Account Settings
                      </Link>
                      {admin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <MdAdminPanelSettings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-slate-600 hover:text-[#8B0000] transition-colors rounded-lg hover:bg-red-50"
                  title="Login"
                >
                  <FiUser size={20} />
                </Link>
              )}

              {/* Wishlist */}
              {authenticated && (
                <Link
                  to="/wishlist"
                  title="Wishlist"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/wishlist')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-slate-600 hover:text-[#8B0000] hover:bg-red-50'
                  }`}
                >
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                title="Cart"
                className={`relative p-2 rounded-lg transition-colors ${
                  isActive('/cart')
                    ? 'text-[#8B0000] bg-red-50'
                    : 'text-slate-600 hover:text-[#8B0000] hover:bg-red-50'
                }`}
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#8B0000] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Admin shortcut */}
              {admin && (
                <Link
                  to="/admin"
                  title="Admin Panel"
                  className="p-2 rounded-lg text-slate-600 hover:text-[#8B0000] hover:bg-red-50 transition-colors"
                >
                  <MdAdminPanelSettings size={22} />
                </Link>
              )}
            </div>

            {/* ── Mobile: cart + hamburger ───────────────────────────── */}
            <div className="md:hidden flex items-center gap-2">
              <Link to="/cart" className="relative p-2 text-slate-700">
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-[#8B0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileOpen(v => !v)}
                className="p-2 text-slate-700 hover:text-[#8B0000] transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-3 space-y-1 shadow-lg">

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="px-4 mb-3">
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm px-3 py-2 focus:outline-none"
              />
              <button type="submit" className="px-3 py-2 bg-[#8B0000] text-white">
                <FiSearch size={15} />
              </button>
            </div>
          </form>

          {/* Dynamic category links in mobile */}
          {categories.map(cat => {
            const isActivecat = activeCategorySlug === cat.slug
              && location.pathname.startsWith('/products');
            return (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActivecat
                    ? 'text-[#8B0000] bg-red-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}

          {/* All products link */}
          <Link
            to="/products"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-t border-slate-100 mt-1 pt-3 ${
              location.pathname === '/products' && !activeCategorySlug
                ? 'text-[#8B0000] bg-red-50'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Products
          </Link>

          <div className="border-t border-slate-100 pt-2 mt-2">
            {authenticated ? (
              <>
                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <FiHeart size={17} /> Wishlist
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <FiPackage size={17} /> My Orders
                </Link>
                {admin && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <MdAdminPanelSettings size={17} /> Admin Panel
                  </Link>
                )}
                <div className="px-4 py-2 flex items-center gap-3 border-t border-slate-100 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B0000] to-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <FiLogOut size={17} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-1">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-[#8B0000] border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-[#8B0000] hover:bg-red-900 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
