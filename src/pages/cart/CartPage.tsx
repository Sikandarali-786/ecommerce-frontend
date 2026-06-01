import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '../../hooks/useCart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { Category } from '../../types';
import { getImageUrl } from '../../utils/image';

const CartPage = () => {
  const { data, isLoading, isError } = useCart();
  const updateCartMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Cart</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const cart = data?.cart;
  const total = data?.total || 0;
  const items = cart?.items || [];

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCartMutation.mutate(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCartMutation.mutate();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<FiShoppingCart />}
          title="Your cart is empty"
          description="Add some products to your cart to see them here"
          action={
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{items.length} item(s) in your cart</p>
          </div>
          <button
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
            className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2 disabled:opacity-50"
          >
            <FiTrash2 size={18} />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const category = item.product.category as Category;
              const imageUrl = getImageUrl(item.product.images?.[0]);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.product.title}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {category && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-1">
                            {category.name}
                          </span>
                        )}
                        <Link to={`/products/${item.product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={removeFromCartMutation.isPending}
                        className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xl font-bold text-gray-900">
                        ${item.product.price.toFixed(2)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateCartMutation.isPending}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock || updateCartMutation.isPending}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-xl font-bold text-blue-600">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.product.stock && (
                      <p className="text-sm text-orange-600 mt-2">
                        Maximum available quantity reached
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
              >
                <span>Proceed to Checkout</span>
              </Link>

              <Link
                to="/products"
                className="block text-center text-blue-600 hover:text-blue-700 mt-4 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
