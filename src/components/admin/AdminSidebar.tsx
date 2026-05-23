import { NavLink, Link } from 'react-router-dom';
import {
  FiLayout,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiHome,
  FiLogOut,
} from 'react-icons/fi';
import { logout, getUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiLayout, end: true },
  { to: '/admin/categories', label: 'Categories', icon: FiGrid, end: false },
  { to: '/admin/products', label: 'Products', icon: FiPackage, end: false },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag, end: false },
  { to: '/admin/users', label: 'Users', icon: FiUsers, end: false },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-800">
        <Link to="/admin" className="block">
          <span className="text-xl font-bold text-white">ShopHub</span>
          <span className="block text-xs text-gray-400 mt-1">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FiHome size={20} />
          View Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FiLogOut size={20} />
          Logout
        </button>
        {user && (
          <p className="px-4 pt-2 text-xs text-gray-500 truncate">{user.email}</p>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
