import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiShoppingBag, FiEye, FiX } from 'react-icons/fi';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { Order } from '../../api/order.api';
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  getOrderStatusColor,
  getPaymentStatusColor,
} from '../../utils/orderStatus';

type StatusFilter = 'all' | Order['orderStatus'];

const AdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useAdminOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = data?.orders ?? [];

  const orderFromUrl = searchParams.get('order');
  const activeOrderId = selectedOrder?._id || orderFromUrl;
  const openOrder = activeOrderId
    ? orders.find((o) => o._id === activeOrderId) ?? selectedOrder
    : null;

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filter !== 'all') {
      result = result.filter((o) => o.orderStatus === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) => {
        const customer =
          typeof o.user === 'object'
            ? `${o.user.name} ${o.user.email}`
            : '';
        return (
          o._id.toLowerCase().includes(q) ||
          customer.toLowerCase().includes(q) ||
          o.shippingInfo.fullName.toLowerCase().includes(q)
        );
      });
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, filter, search]);

  const handleStatusChange = (orderId: string, orderStatus: Order['orderStatus']) => {
    updateOrderStatus.mutate({ id: orderId, data: { orderStatus } });
  };

  const handlePaymentChange = (
    orderId: string,
    paymentStatus: Order['paymentStatus']
  ) => {
    updateOrderStatus.mutate({ id: orderId, data: { paymentStatus } });
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setSearchParams({ order: order._id });
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setSearchParams({});
  };

  const getCustomer = (order: Order) => {
    if (typeof order.user === 'object') {
      return { name: order.user.name, email: order.user.email };
    }
    return { name: 'N/A', email: 'N/A' };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600 mt-1">
            View orders and update order & payment status
          </p>
        </div>
        {data && (
          <div className="flex gap-4 text-sm">
            <span className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <strong>{data.totalOrders}</strong> orders
            </span>
            <span className="bg-white px-4 py-2 rounded-lg shadow-sm">
              Revenue: <strong>${data.totalRevenue.toFixed(2)}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="search"
          placeholder="Search by order ID, customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as StatusFilter)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none md:w-48"
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <EmptyState
            icon={<FiShoppingBag className="text-gray-400" />}
            title="No orders found"
            description={
              orders.length === 0
                ? 'Orders will appear here when customers place them.'
                : 'Try adjusting your search or filter.'
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const customer = getCustomer(order);
                  const isUpdating =
                    updateOrderStatus.isPending &&
                    updateOrderStatus.variables?.id === order._id;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-mono text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value as Order['orderStatus']
                            )
                          }
                          disabled={isUpdating}
                          className={`text-xs font-semibold rounded-lg px-2 py-1.5 border-0 cursor-pointer disabled:opacity-50 ${getOrderStatusColor(order.orderStatus)}`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handlePaymentChange(
                              order._id,
                              e.target.value as Order['paymentStatus']
                            )
                          }
                          disabled={isUpdating}
                          className={`text-xs font-semibold rounded-lg px-2 py-1.5 border-0 cursor-pointer disabled:opacity-50 ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(order)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <FiEye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {openOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Order #{openOrder._id.slice(-8)}
              </h2>
              <button
                type="button"
                onClick={closeDetail}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Order Status</p>
                  <select
                    value={openOrder.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        openOrder._id,
                        e.target.value as Order['orderStatus']
                      )
                    }
                    disabled={updateOrderStatus.isPending}
                    className={`w-full text-sm font-semibold rounded-lg px-3 py-2 border border-gray-200 ${getOrderStatusColor(openOrder.orderStatus)}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Payment Status</p>
                  <select
                    value={openOrder.paymentStatus}
                    onChange={(e) =>
                      handlePaymentChange(
                        openOrder._id,
                        e.target.value as Order['paymentStatus']
                      )
                    }
                    disabled={updateOrderStatus.isPending}
                    className={`w-full text-sm font-semibold rounded-lg px-3 py-2 border border-gray-200 ${getPaymentStatusColor(openOrder.paymentStatus)}`}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
                <p className="text-sm text-gray-700">
                  {getCustomer(openOrder).name} ({getCustomer(openOrder).email})
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">
                  {openOrder.shippingInfo.fullName}
                  <br />
                  {openOrder.shippingInfo.address}
                  <br />
                  {openOrder.shippingInfo.city}, {openOrder.shippingInfo.state}{' '}
                  {openOrder.shippingInfo.zipCode}
                  <br />
                  {openOrder.shippingInfo.country}
                  <br />
                  Phone: {openOrder.shippingInfo.phone}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                <ul className="divide-y divide-gray-100 border rounded-lg">
                  {openOrder.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 p-3 text-sm"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover bg-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-gray-500">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${openOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${openOrder.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${openOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>${openOrder.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  Payment: {openOrder.paymentMethod} · Placed{' '}
                  {new Date(openOrder.orderDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
