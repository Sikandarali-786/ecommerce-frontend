import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '../../hooks/useWishlist';
import { useAddToCart } from '../../hooks/useCart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import Button from '../../components/Button';
import type { Category } from '../../types';
import { getImageUrl } from '../../utils/image';

const WishlistPage = () => {
  const { data, isLoading, isError } = useWishlist();
  const removeFromWishlistMutation   = useRemoveFromWishlist();
  const clearWishlistMutation        = useClearWishlist();
  const addToCartMutation            = useAddToCart();

  const [clearModalOpen, setClearModalOpen]   = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeProductId, setRemoveProductId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Wishlist</h2>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  const products = data?.wishlist?.products ?? [];

  const openRemoveModal = (productId: string) => {
    setRemoveProductId(productId);
    setRemoveModalOpen(true);
  };

  const confirmRemove = () => {
    if (removeProductId) {
      removeFromWishlistMutation.mutate(removeProductId, {
        onSettled: () => {
          setRemoveModalOpen(false);
          setRemoveProductId(null);
        },
      });
    }
  };

  const confirmClear = () => {
    clearWishlistMutation.mutate(undefined, {
      onSettled: () => setClearModalOpen(false),
    });
  };

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<FiHeart />}
          title="Your wishlist is empty"
          description="Save your favourite products here and add them to your cart when you're ready."
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">
              {products.length} item{products.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Button
            variant="dangerGhost"
            size="sm"
            onClick={() => setClearModalOpen(true)}
            disabled={clearWishlistMutation.isPending}
            leftIcon={<FiTrash2 size={16} />}
          >
            Clear Wishlist
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => {
            const category = product.category as Category;
            const imageUrl = getImageUrl(product.images?.[0]);

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <Link to={`/products/${product._id}`}>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={e => { e.currentTarget.src = 'https://placehold.co/300x300?text=No+Image'; }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1.5 rounded-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  {/* Category */}
                  {category && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {category.name}
                    </span>
                  )}

                  {/* Title */}
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mt-2 mb-1 min-h-10">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {product.price.toFixed(2)}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCartMutation.mutate({ productId: product._id, quantity: 1 })}
                      disabled={product.stock === 0}
                      loading={addToCartMutation.isPending}
                      leftIcon={<FiShoppingCart size={15} />}
                      className="flex-1"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openRemoveModal(product._id)}
                      disabled={removeFromWishlistMutation.isPending}
                      title="Remove from wishlist"
                      className="w-9 h-9 px-0! border-red-300 text-red-600 hover:bg-red-50 shrink-0"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={clearModalOpen}
        title="Clear your wishlist?"
        message="All saved items will be removed. You can always re-add them later."
        confirmLabel="Yes, clear it"
        isLoading={clearWishlistMutation.isPending}
        onConfirm={confirmClear}
        onCancel={() => setClearModalOpen(false)}
      />

      <ConfirmModal
        isOpen={removeModalOpen}
        title="Remove from wishlist?"
        message="This item will be removed from your saved list."
        confirmLabel="Remove"
        isLoading={removeFromWishlistMutation.isPending}
        onConfirm={confirmRemove}
        onCancel={() => { setRemoveModalOpen(false); setRemoveProductId(null); }}
      />
    </div>
  );
};

export default WishlistPage;
