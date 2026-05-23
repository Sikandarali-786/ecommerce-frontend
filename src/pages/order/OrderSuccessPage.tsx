import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';
import { useOrder } from '../../hooks/useOrders';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useOrder(orderId || '');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data?.order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiHome />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const order = data.order;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We've received your order and will process it soon.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold text-blue-600">{order._id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Status</span>
              <span className="font-semibold text-blue-600">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Payment Status</span>
              <span className="font-semibold text-orange-600">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{order.shippingInfo.fullName}</p>
            <p>{order.shippingInfo.email}</p>
            <p>{order.shippingInfo.phone}</p>
            <p>{order.shippingInfo.address}</p>
            <p>
              {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
            </p>
            <p>{order.shippingInfo.country}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                <img
                  src={item.image || 'https://via.placeholder.com/80x80'}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80x80';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold">
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span className="font-semibold">${order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <FiPackage />
            <span>View My Orders</span>
          </Link>
          <Link
            to="/products"
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            <FiHome />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            You will receive an email confirmation shortly with your order details.
            {order.paymentMethod === 'COD' && (
              <span className="block mt-2 font-semibold">
                Please keep the exact amount ready for cash on delivery.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
