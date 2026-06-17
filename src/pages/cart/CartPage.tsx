import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '../../hooks/useCart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import Button from '../../components/Button';
import type { Category } from '../../types';
import { getImageUrl } from '../../utils/image';

const CartPage = () => {
  const { data, isLoading, isError } = useCart();
  const updateCartMutation      = useUpdateCartItem();
  const removeFromCartMutation  = useRemoveFromCart();
  const clearCartMutation       = useClearCart();

  // Modal states
  const [clearModalOpen, setClearModalOpen]     = useState(false);
  const [removeModalOpen, setRemoveModalOpen]   = useState(false);
  const [removeProductId, setRemoveProductId]   = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Cart</h2>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  const cart  = data?.cart;
  const total = data?.total || 0;
  const items = cart?.items || [];

  const shippingCost = total > 100 ? 0 : 10;
  const tax          = parseFloat((total * 0.1).toFixed(2));
  const grandTotal   = total + shippingCost + tax;

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    updateCartMutation.mutate({ productId, quantity: newQty });
  };

  const openRemoveModal = (productId: string) => {
    setRemoveProductId(productId);
    setRemoveModalOpen(true);
  };

  const confirmRemove = () => {
    if (removeProductId) {
      removeFromCartMutation.mutate(removeProductId, {
        onSettled: () => {
          setRemoveModalOpen(false);
          setRemoveProductId(null);
        },
      });
    }
  };

  const confirmClear = () => {
    clearCartMutation.mutate(undefined, {
      onSettled: () => setClearModalOpen(false),
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<FiShoppingCart />}
          title="Your cart is empty"
          description="Add some products to your cart to see them here"
          action={
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button
            variant="dangerGhost"
            size="sm"
            onClick={() => setClearModalOpen(true)}
            disabled={clearCartMutation.isPending}
            leftIcon={<FiTrash2 size={16} />}
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart items ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const category = item.product.category as Category;
              const imageUrl = getImageUrl(item.product.images?.[0]);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Image */}
                  <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.product.title}
                      className="w-full sm:w-28 h-28 object-cover rounded-lg"
                      onError={e => { e.currentTarget.src = 'https://placehold.co/150x150?text=No+Image'; }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        {category && (
                          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
                            {category.name}
                          </span>
                        )}
                        <Link to={`/products/${item.product._id}`}>
                          <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {item.product.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRemoveModal(item.product._id)}
                        disabled={removeFromCartMutation.isPending}
                        title="Remove item"
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 !px-1"
                      >
                        <FiTrash2 size={18} />
                      </Button>
                    </div>

                    {/* Price + Qty */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.product.price.toFixed(2)}
                      </span>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateCartMutation.isPending}
                          className="w-8 h-8 !px-0"
                        >
                          <FiMinus size={14} />
                        </Button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock || updateCartMutation.isPending}
                          className="w-8 h-8 !px-0"
                        >
                          <FiPlus size={14} />
                        </Button>
                      </div>

                      <span className="text-lg font-bold text-blue-600">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.quantity >= item.product.stock && (
                      <p className="text-xs text-orange-600 mt-2">Max quantity reached</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order summary ──────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0
                      ? <span className="text-green-600">FREE</span>
                      : `$${shippingCost.toFixed(2)}`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Free shipping nudge */}
              {total < 100 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-5">
                  <p className="text-xs text-amber-800 font-medium">
                    🚚 Add <span className="font-bold">${(100 - total).toFixed(2)}</span> more for free shipping!
                  </p>
                  <div className="mt-1.5 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                Proceed to Checkout
                <FiArrowRight size={16} />
              </Link>

              <Link
                to="/products"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-4 font-medium transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={clearModalOpen}
        title="Clear your cart?"
        message="This will remove all items from your cart. This action cannot be undone."
        confirmLabel="Yes, clear cart"
        isLoading={clearCartMutation.isPending}
        onConfirm={confirmClear}
        onCancel={() => setClearModalOpen(false)}
      />

      <ConfirmModal
        isOpen={removeModalOpen}
        title="Remove item?"
        message="Are you sure you want to remove this item from your cart?"
        confirmLabel="Remove"
        isLoading={removeFromCartMutation.isPending}
        onConfirm={confirmRemove}
        onCancel={() => { setRemoveModalOpen(false); setRemoveProductId(null); }}
      />
    </div>
  );
};

export default CartPage;
