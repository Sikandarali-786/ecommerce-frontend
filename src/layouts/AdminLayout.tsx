import { useState } from 'react';
import logoImg from '../assets/images/logo.png';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiLogOut,
  FiMenu,
  FiChevronRight,
} from 'react-icons/fi';
import { logout, getUser } from '../utils/auth';

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <FiGrid size={20} />,
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: <FiPackage size={20} />,
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: <FiTag size={20} />,
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: <FiShoppingBag size={20} />,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: <FiUsers size={20} />,
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoImg} alt="ShopHub" className="h-9 object-contain" />
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Admin Info */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
              isActive(item.path)
                ? 'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            <FiChevronRight
              size={16}
              className={`transition-transform ${
                isActive(item.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
              }`}
            />
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-gray-700 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
        >
          <FiGrid size={20} />
          <span className="font-medium">View Store</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FiMenu size={24} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span>Admin</span>
              {location.pathname !== '/admin' && (
                <>
                  <FiChevronRight size={14} />
                  <span className="text-gray-900 font-medium capitalize">
                    {location.pathname.split('/admin/')[1]?.split('/')[0] || ''}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
