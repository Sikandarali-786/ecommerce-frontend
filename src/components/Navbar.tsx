import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingCart, FiLogOut, FiMenu, FiX, FiHeart,
  FiPackage, FiChevronDown, FiSettings, FiSearch, FiUser, FiMapPin,
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { isAuthenticated, isAdmin, logout, getUser } from '../utils/auth';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useCategories';
import logoImg from '../assets/images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState(' Pakistan');
  const [locationInput, setLocationInput] = useState('Hussain Agahi Market, Multan');
  const [locationPin, setLocationPin] = useState({ lat: 30.1959895, lng: 71.4750566 });
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${locationPin.lat},${locationPin.lng}&z=17&output=embed`;
  const googleMapsLink = 'https://maps.app.goo.gl/ECdA7b4iphZjXf2e9';
  const whatsappNumber = '923048405899'; // replace with your WhatsApp number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I want to place an order from Afzal Bikerz Store.')}`;
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const user = getUser();
  const showCustomerActions = !admin;

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

  const openLocationModal = () => {
    setLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setLocationModalOpen(false);
  };

  const confirmLocation = () => {
    setLocationLabel(`Other · ${locationInput}`);
    closeLocationModal();
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const goToLogin = (targetPath: string) => {
    navigate('/login', { state: { from: targetPath } });
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';


  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── Top info bar ──────────────────────────────────────────────── */}
      <div className="bg-linear-to-r from-[#10354a] to-[#cf531f] text-white text-sm">
        <div className="mx-auto flex flex-wrap items-center gap-3 px-4 py-3 lg:flex-nowrap lg:justify-between lg:px-6 xl:px-8">
          <div className="flex flex-wrap items-center gap-5 text-[13px]">
            <Link to="/" className="flex items-center shrink-0 mr-4">
              <img
                src={logoImg}
                alt="Afzal Bikerz Store"
                className="h-16 w-auto object-contain rounded-sm"
              />
            </Link>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-3 min-w-70">
            <button
              type="button"
              onClick={openLocationModal}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-white hover:text-slate-900 transition-colors"
            >
              <FiMapPin size={18} className="text-[#8B0000]" />
              {locationLabel}
            </button>

            <form onSubmit={handleSearch} className="relative flex-1 min-w-55">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full rounded-full border border-white/30 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#8B0000] p-2 text-white hover:bg-[#7a0f07] transition-colors"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#f97316] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm sm:text-sm">
            <span>Pakistan's #1 Motorcycle Parts Store</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/25 transition-colors"
            >
              Order to WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main navbar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <nav className="w-full px-4 sm:px-6 lg:px-14">
          <div className="flex items-center justify-between h-17.5">
            {/* ── Desktop nav: dynamic categories ───────────────────── */}

            <div className="hidden lg:block flex-1 overflow-hidden">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
                {categories.length === 0 ? (
                  // Skeleton placeholders while loading
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-24 bg-slate-100 rounded animate-pulse mx-1.5 shrink-0"
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
                        className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors rounded-md shrink-0 ${isActivecat
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
            </div>

            {/* ── Desktop right actions ──────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1 ml-2 shrink-0">

              {/* Search */}
              {/* <div className="relative">
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
                      className="ml-1 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <FiX size={16} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-slate-600 hover:text-[#8B0000] transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Search"
                  >
                    <FiSearch size={20} />
                  </button>
                )}
              </div> */}

              {/* User / Auth */}
              {authenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-linear-to-r from-[#10354a] to-[#cf531f] flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                  className="p-2 text-slate-600 hover:text-[#8B0000] transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Login"
                >
                  <FiUser size={20} />
                </Link>
              )}

              {/* Wishlist */}
              {showCustomerActions && (
                authenticated ? (
                  <Link
                    to="/wishlist"
                    title="Wishlist"
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${isActive('/wishlist')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-slate-600 hover:text-[#8B0000] hover:bg-red-50'
                      }`}
                  >
                    <FiHeart size={20} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToLogin('/wishlist')}
                    title="Wishlist"
                    className="p-2 rounded-lg text-slate-600 hover:text-[#8B0000] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <FiHeart size={20} />
                  </button>
                )
              )}

              {/* Orders */}
              {showCustomerActions && (
                authenticated ? (
                  <Link
                    to="/orders"
                    title="Orders"
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${isActive('/orders')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-slate-600 hover:text-[#8B0000] hover:bg-red-50'
                      }`}
                  >
                    <FiPackage size={20} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToLogin('/orders')}
                    title="Orders"
                    className="p-2 rounded-lg text-slate-600 hover:text-[#8B0000] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <FiPackage size={20} />
                  </button>
                )
              )}

              {/* Cart */}
              {showCustomerActions && (
                authenticated ? (
                  <Link
                    to="/cart"
                    title="Cart"
                    className={`relative p-2 rounded-lg transition-colors cursor-pointer ${isActive('/cart')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-slate-600 hover:text-[#8B0000] hover:bg-red-50'
                      }`}
                  >
                    <FiShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 bg-linear-to-r from-[#10354a] to-[#cf531f] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToLogin('/cart')}
                    title="Cart"
                    className="relative p-2 rounded-lg text-slate-600 hover:text-[#8B0000] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <FiShoppingCart size={20} />
                  </button>
                )
              )}

              {/* Admin shortcut */}
              {admin && (
                <Link
                  to="/admin"
                  title="Admin Panel"
                  className="p-2 rounded-lg text-slate-600 hover:text-[#8B0000] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <MdAdminPanelSettings size={22} />
                </Link>
              )}
            </div>

            {/* ── Mobile: actions + hamburger ─────────────────────────── */}
            <div className="md:hidden flex items-center gap-1.5">
              {showCustomerActions && (
                authenticated ? (
                  <>
                    <Link to="/wishlist" className="p-2 text-slate-700" aria-label="Wishlist">
                      <FiHeart size={20} />
                    </Link>
                    <Link to="/orders" className="p-2 text-slate-700" aria-label="Orders">
                      <FiPackage size={20} />
                    </Link>
                    <Link to="/cart" className="relative p-2 text-slate-700 cursor-pointer" aria-label="Cart">
                      <FiShoppingCart size={22} />
                      {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-4.25 h-4.25 bg-linear-to-r from-[#10354a] to-[#cf531f] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => goToLogin('/wishlist')}
                      className="p-2 text-slate-700 cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <FiHeart size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToLogin('/orders')}
                      className="p-2 text-slate-700 cursor-pointer"
                      aria-label="Orders"
                    >
                      <FiPackage size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToLogin('/cart')}
                      className="relative p-2 text-slate-700 cursor-pointer"
                      aria-label="Cart"
                    >
                      <FiShoppingCart size={22} />
                    </button>
                  </>
                )
              )}
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

          {/* Mobile location + search */}
          <div className="px-4 mb-3 space-y-3">
            <button
              type="button"
              onClick={openLocationModal}
              className="w-full inline-flex items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <FiMapPin size={18} className="text-[#8B0000]" />
                {locationLabel}
              </span>
              <span className="text-xs text-slate-500">Change</span>
            </button>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#8B0000] p-2 text-white hover:bg-[#7a0f07] transition-colors"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>

          {/* Dynamic category links in mobile */}
          {categories.map(cat => {
            const isActivecat = activeCategorySlug === cat.slug
              && location.pathname.startsWith('/products');
            return (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${isActivecat
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
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-t border-slate-100 mt-1 pt-3 ${location.pathname === '/products' && !activeCategorySlug
              ? 'text-[#8B0000] bg-red-50'
              : 'text-slate-700 hover:bg-slate-50'
              }`}
          >
            All Products
          </Link>

          <div className="border-t border-slate-100 pt-2 mt-2">
            {authenticated ? (
              <>
                {showCustomerActions && (
                  <>
                    <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <FiHeart size={17} /> Wishlist
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <FiPackage size={17} /> My Orders
                    </Link>
                    <Link to="/cart" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <FiShoppingCart size={17} /> Cart
                    </Link>
                  </>
                )}
                {admin && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <MdAdminPanelSettings size={17} /> Admin Panel
                  </Link>
                )}
                <div className="px-4 py-2 flex items-center gap-3 border-t border-slate-100 mt-1">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#10354a] to-[#cf531f] flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
                >
                  <FiLogOut size={17} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-1">
                {showCustomerActions && (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => goToLogin('/wishlist')}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 py-3 text-slate-700 hover:border-[#8B0000] hover:text-[#8B0000] hover:bg-red-50 transition-colors"
                    >
                      <FiHeart size={18} />
                      <span className="text-[11px] font-medium">Wishlist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToLogin('/orders')}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 py-3 text-slate-700 hover:border-[#8B0000] hover:text-[#8B0000] hover:bg-red-50 transition-colors"
                    >
                      <FiPackage size={18} />
                      <span className="text-[11px] font-medium">Orders</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToLogin('/cart')}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 py-3 text-slate-700 hover:border-[#8B0000] hover:text-[#8B0000] hover:bg-red-50 transition-colors"
                    >
                      <FiShoppingCart size={18} />
                      <span className="text-[11px] font-medium">Cart</span>
                    </button>
                  </div>
                )}
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-[#10354a] border border-[#10354a]/30 hover:bg-[#10354a]/5 transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-[#10354a] to-[#cf531f] hover:opacity-90 transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm text-slate-500">Select delivery location</p>
                <h2 className="text-xl font-semibold text-slate-900">Choose address</h2>
              </div>
              <button
                type="button"
                onClick={closeLocationModal}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1  gap-4 p-5">

              <div className="relative h-96 overflow-hidden rounded-3xl bg-slate-100">
                <iframe
                  title="Pakistan Location Map"
                  src={googleMapsEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-black/60 p-4 text-white">
                    <div>
                      <p className="text-xs uppercase tracking-[.18em] text-slate-200">Selected delivery area</p>
                      <p className="mt-1 text-lg font-semibold">Hussain Agahi Market</p>
                      <p className="text-sm text-slate-300">Multan, Pakistan</p>
                    </div>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/20"
                    >
                      <FiMapPin size={16} />
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;