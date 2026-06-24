import { useState, useMemo } from 'react';
import { FiSearch, FiShoppingBag, FiEye, FiX, FiFilter } from 'react-icons/fi';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { API_ENDPOINTS } from '../../api/endpoints';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import type { Order } from '../../api/order.api';

const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors: Record<string, string> = {
  Processing: 'bg-blue-100 text-blue-800',
  Confirmed:  'bg-purple-100 text-purple-800',
  Shipped:    'bg-orange-100 text-orange-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
};

const paymentColors: Record<string, string> = {
  Paid:    'bg-green-100 text-green-800',
  Failed:  'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

// ── Admin Orders Page ─────────────────────────────────────────────────────────
const AdminOrdersPage = () => {
  const queryClient = useQueryClient();

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ── Fetch orders ───────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn:  async () => {
      const res = await axiosInstance.get(API_ENDPOINTS.ORDER.ADMIN_GET_ALL);
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      axiosInstance.put(API_ENDPOINTS.ORDER.ADMIN_UPDATE_STATUS(id), { orderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
      setSelectedOrder(null);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  const orders: Order[] = data?.orders || [];

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q          = search.trim().toLowerCase();
    const fromTs     = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0)    : null;
    const toTs       = dateTo   ? new Date(dateTo).setHours(23, 59, 59, 999) : null;

    return orders.filter(o => {
      // Search: order ID tail, customer name, customer email
      if (q) {
        const name  = typeof o.user === 'object' ? (o.user?.name  ?? '') : '';
        const email = typeof o.user === 'object' ? (o.user?.email ?? '') : '';
        const matches =
          o._id.toLowerCase().includes(q) ||
          name.toLowerCase().includes(q)  ||
          email.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status filter
      if (filterStatus !== 'all' && o.orderStatus !== filterStatus) return false;

      // Date range filter
      const orderTs = new Date(o.orderDate).getTime();
      if (fromTs && orderTs < fromTs) return false;
      if (toTs   && orderTs > toTs)   return false;

      return true;
    });
  }, [orders, search, filterStatus, dateFrom, dateTo]);

  // Check if any filter is active
  const hasActiveFilters = search || filterStatus !== 'all' || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
            {data?.totalRevenue !== undefined && (
              <> · Total Revenue: <span className="font-semibold text-gray-700">${data.totalRevenue.toFixed(2)}</span></>
            )}
          </p>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-37.5"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Date range row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFilter size={14} />
            <span className="font-medium">Date range:</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={e => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear all filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              <FiX size={14} />
              Clear filters
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-1">
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Search: "{search}"
                <button onClick={() => setSearch('')}><FiX size={11} /></button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus('all')}><FiX size={11} /></button>
              </span>
            )}
            {(dateFrom || dateTo) && (
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Date: {dateFrom || '…'} → {dateTo || '…'}
                <button onClick={() => { setDateFrom(''); setDateTo(''); }}><FiX size={11} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Orders Table ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FiShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">No orders match your filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-700 whitespace-nowrap">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {typeof order.user === 'object' ? (order.user?.name ?? 'N/A') : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {typeof order.user === 'object' ? (order.user?.email ?? '—') : '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${paymentColors[order.paymentStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.orderStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        <FiEye size={15} />
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Order Detail / Status Modal ─────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="p-6 space-y-5">

              {/* Customer */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Customer</h3>
                <p className="font-semibold text-gray-900">
                  {typeof selectedOrder.user === 'object' ? (selectedOrder.user?.name ?? 'N/A') : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {typeof selectedOrder.user === 'object' ? (selectedOrder.user?.email ?? '—') : '—'}
                </p>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedOrder.shippingInfo.fullName}<br />
                  {selectedOrder.shippingInfo.address}<br />
                  {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}{' '}
                  {selectedOrder.shippingInfo.zipCode}<br />
                  {selectedOrder.shippingInfo.country}
                </p>
                <p className="text-sm text-gray-500 mt-1">📞 {selectedOrder.shippingInfo.phone}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items</h3>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate pr-4">{item.title} × {item.quantity}</span>
                      <span className="font-semibold shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-1.5 text-sm">
                {[
                  { label: 'Subtotal',  value: `$${selectedOrder.subtotal.toFixed(2)}` },
                  { label: 'Shipping',  value: selectedOrder.shippingCost === 0 ? 'FREE' : `$${selectedOrder.shippingCost.toFixed(2)}` },
                  { label: 'Tax',       value: `$${selectedOrder.tax.toFixed(2)}` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-gray-600">
                    <span>{r.label}</span><span>{r.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                  <span>Total</span><span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment & order status badges */}
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${paymentColors[selectedOrder.paymentStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                  💳 {selectedOrder.paymentStatus}
                </span>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[selectedOrder.orderStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                  📦 {selectedOrder.orderStatus}
                </span>
              </div>

              {/* Update Status */}
              {selectedOrder.orderStatus !== 'Cancelled' && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Update Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ORDER_STATUSES.filter(s => s !== 'Cancelled').map(status => (
                      <Button
                        key={status}
                        variant={selectedOrder.orderStatus === status ? 'secondary' : 'primary'}
                        size="sm"
                        disabled={selectedOrder.orderStatus === status}
                        loading={updateStatusMutation.isPending}
                        onClick={() =>
                          updateStatusMutation.mutate({ id: selectedOrder._id, orderStatus: status })
                        }
                        className="w-full"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
