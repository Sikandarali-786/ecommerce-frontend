import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '../../hooks/useWishlist';
import { useAddToCart } from '../../hooks/useCart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { Category } from '../../types';

const WishlistPage = () => {
  const { data, isLoading, isError } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const clearWishlistMutation = useClearWishlist();
  const addToCartMutation = useAddToCart();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Wishlist</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const wishlist = data?.wishlist;
  const products = wishlist?.products || [];

  const handleRemoveItem = (productId: string) => {
    removeFromWishlistMutation.mutate(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlistMutation.mutate();
    }
  };

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<FiHeart />}
          title="Your wishlist is empty"
          description="Save your favorite products to your wishlist"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{products.length} item(s) in your wishlist</p>
          </div>
          <button
            onClick={handleClearWishlist}
            disabled={clearWishlistMutation.isPending}
            className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2 disabled:opacity-50"
          >
            <FiTrash2 size={18} />
            <span>Clear Wishlist</span>
          </button>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const category = product.category as Category;
            const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/products/${product._id}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold bg-red-600 px-4 py-2 rounded-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  {/* Category Badge */}
                  {category && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {category.name}
                    </span>
                  )}

                  {/* Product Title */}
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2 min-h-[3.5rem]">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.stock === 0 || addToCartMutation.isPending}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiShoppingCart size={16} />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                    <button
                      onClick={() => handleRemoveItem(product._id)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="p-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
