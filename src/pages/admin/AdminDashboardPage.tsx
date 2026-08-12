import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiTrendingUp,
  FiClock,
} from 'react-icons/fi';
import { useDashboardStats } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import Table from '../../components/Table';
import type { TableColumn } from '../../components/Table';

const AdminDashboardPage = () => {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];
  const ordersByStatus = data?.ordersByStatus || [];

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <FiUsers size={32} />,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <FiPackage size={32} />,
      color: 'bg-green-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <FiShoppingBag size={32} />,
      color: 'bg-purple-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `${(stats?.totalRevenue ?? 0).toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <span className="text-2xl font-bold">PKR</span>,
      color: 'bg-orange-500',
      link: '/admin/orders',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'Shipped':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  type RecentOrder = (typeof recentOrders)[number];

  const recentOrderColumns: TableColumn<RecentOrder>[] = [
    {
      header: 'Order ID',
      cell: (order) => (
        <span className="font-medium text-gray-900 whitespace-nowrap">
          {order._id.slice(-8)}
        </span>
      ),
    },
    {
      header: 'Customer',
      cell: (order) => (
        <div className="whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {typeof order.user === 'object' ? (order.user?.name ?? 'N/A') : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {typeof order.user === 'object' ? (order.user?.email ?? '—') : '—'}
          </div>
        </div>
      ),
    },
    {
      header: 'Items',
      cell: (order) => `${order.items.length} item(s)`,
    },
    {
      header: 'Total',
      cell: (order) => (
        <span className="font-semibold text-gray-900 whitespace-nowrap">
          ${order.total.toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (order) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (order) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {new Date(order.orderDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (order) => (
        <Link
          to={`/admin/orders/${order._id}`}
          className="text-blue-600 hover:text-blue-900 font-medium text-sm whitespace-nowrap"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Order Status Breakdown */}
        {ordersByStatus.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FiTrendingUp className="mr-2" />
              Orders by Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ordersByStatus.map((status) => (
                <div
                  key={status._id}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <p className="text-sm text-gray-600 mb-1">{status._id}</p>
                  <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiClock className="mr-2" />
              Recent Orders
            </h2>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No orders yet
            </div>
          ) : (
            <Table
              columns={recentOrderColumns}
              data={recentOrders}
              rowKey={(order) => order._id}
            />
          )}

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-900 font-medium text-sm"
            >
              View all orders →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/categories"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FiGrid className="mx-auto mb-3 text-teal-500" size={40} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Categories
            </h3>
            <p className="text-sm text-gray-600">
              Add, edit, or remove product categories
            </p>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FiPackage className="mx-auto mb-3 text-green-500" size={40} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Products
            </h3>
            <p className="text-sm text-gray-600">
              Add, edit, or remove products from your store
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FiShoppingBag className="mx-auto mb-3 text-purple-500" size={40} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Orders
            </h3>
            <p className="text-sm text-gray-600">
              View and update order statuses
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FiUsers className="mx-auto mb-3 text-blue-500" size={40} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Users
            </h3>
            <p className="text-sm text-gray-600">
              View and manage user accounts
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
