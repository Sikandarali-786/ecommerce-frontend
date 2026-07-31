import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useOrders, useCancelOrder } from '../../hooks/useOrders';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import Button from '../../components/Button';
import type { Order } from '../../api/order.api';

const OrdersPage = () => {
  const { data, isLoading } = useOrders();
  const cancelOrderMutation = useCancelOrder();

  const [filter, setFilter] = useState<
    'all' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  >('all');

  // ── Cancel confirmation state ─────────────────────────────────────────────
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  const orders = data?.orders || [];

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter(order => order.orderStatus === filter);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
  );

  // Called when user clicks "Cancel Order" on any card — opens the modal
  const handleCancelRequest = (orderId: string) => {
    setCancelOrderId(orderId);
  };

  // Called when user confirms inside the modal
  const handleCancelConfirm = () => {
    if (!cancelOrderId) return;
    cancelOrderMutation.mutate(cancelOrderId, {
      onSettled: () => setCancelOrderId(null),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'text-blue-600 bg-blue-50';
      case 'Confirmed':  return 'text-purple-600 bg-purple-50';
      case 'Shipped':    return 'text-orange-600 bg-orange-50';
      case 'Delivered':  return 'text-green-600 bg-green-50';
      case 'Cancelled':  return 'text-red-600 bg-red-50';
      default:           return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':            return <FiClock />;
      case 'Confirmed':
      case 'Shipped':               return <FiPackage />;
      case 'Delivered':             return <FiCheckCircle />;
      case 'Cancelled':             return <FiXCircle />;
      default:                      return <FiPackage />;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<FiShoppingBag />}
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping to see your orders here."
          action={
            <Link to="/products">
              <Button variant="primary" size="lg">
                Browse Products
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
              status => (
                <Button
                  key={status}
                  variant="tab"
                  active={filter === status}
                  size="md"
                  onClick={() => setFilter(status)}
                >
                  {status === 'all' ? 'All Orders' : status}
                  {status === 'all' && ` (${orders.length})`}
                  {status !== 'all' &&
                    ` (${orders.filter(o => o.orderStatus === status).length})`}
                </Button>
              ),
            )}
          </div>
        </div>

        {/* Orders List */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No orders found with status: {filter}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onCancelRequest={handleCancelRequest}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                // Only show loading on the specific card being cancelled
                isCancelling={
                  cancelOrderMutation.isPending && cancelOrderId === order._id
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Cancel Confirm Modal ─────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={!!cancelOrderId}
        title="Cancel this order?"
        message="This will cancel your order. If payment was made, a refund will be processed. This action cannot be undone."
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
        variant="danger"
        isLoading={cancelOrderMutation.isPending}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelOrderId(null)}
      />
    </div>
  );
};

// ── Order Card ────────────────────────────────────────────────────────────────
interface OrderCardProps {
  order: Order;
  onCancelRequest: (orderId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement;
  isCancelling: boolean;
}

const OrderCard = ({
  order,
  onCancelRequest,
  getStatusColor,
  getStatusIcon,
  isCancelling,
}: OrderCardProps) => {
  const canCancel = order.orderStatus === 'Processing';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">

      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm break-all">
                {order._id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-bold text-blue-600">{order.total.toFixed(2)}</p>

            </div>
          </div>
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
              order.orderStatus,
            )}`}
          >
            {getStatusIcon(order.orderStatus)}
            <span className="font-semibold text-sm">{order.orderStatus}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4">
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img
                src={item.image || 'https://placehold.co/60x60?text=No+Img'}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
                onError={e => {
                  e.currentTarget.src = 'https://placehold.co/60x60?text=No+Img';
                }}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × {item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-gray-600">Payment: </span>
              <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-600">Status: </span>
              <span
                className={`font-semibold ${
                  order.paymentStatus === 'Paid'
                    ? 'text-green-600'
                    : order.paymentStatus === 'Failed'
                    ? 'text-red-600'
                    : 'text-orange-600'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to={`/order-success/${order._id}`}>
              <Button variant="primary" size="md">View Details</Button>
            </Link>
            {canCancel && (
              <Button
                variant="danger"
                size="md"
                onClick={() => onCancelRequest(order._id)}
                loading={isCancelling}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
