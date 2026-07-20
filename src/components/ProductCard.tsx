import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useAddToCart } from '../hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from '../hooks/useWishlist';
import { isAdmin } from '../utils/auth';
import type { Product, Category } from '../types';
import { getImageUrl } from '../utils/image';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const category = product.category as Category;
  const imageUrl = getImageUrl(product.images?.[0]);
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useIsInWishlist(product._id);
  const admin = isAdmin();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate({ productId: product._id, quantity: 1 });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product._id);
    } else {
      addToWishlistMutation.mutate({ productId: product._id });
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 shadow-xl bg-linear-to-r from-[#10354a] to-[#cf531f] text-white">
      {/* Price badge (top-right) */}
      {/* Wishlist Button - moved to top-left */}
      {!admin && (
        <button
          onClick={handleToggleWishlist}
          disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
          className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all ${
            isInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/10 text-white hover:bg-white/20'
          } shadow-md disabled:opacity-50`}
        >
          <FiHeart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
      )}

      <Link to={`/products/${product._id}`}>
        <div className="relative h-56 flex items-center justify-center bg-linear-to-b from-transparent to-black/20">
          {/* Glow behind image using orange/orange-red like the design */}
          <div className="absolute w-40 h-40 rounded-full opacity-70 bg-linear-to-r from-[#ff7a1a] to-[#cf531f] blur-3xl" />

          <img
            src={imageUrl}
            alt={product.title}
            className="relative w-48 h-48 object-contain transform transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/300x300?text=No+Image';
            }}
          />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white text-lg font-semibold bg-red-600 px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Only {product.stock} left
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 bg-transparent">
        {/* Category Badge */}
        {category && (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white/90 bg-black/20 rounded-full mb-2">
            {category.name}
          </span>
        )}

        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-white hover:text-blue-300 transition-colors line-clamp-2 mb-2 min-h-14">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-300 line-clamp-2 mb-4 min-h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-white">
              {product.price.toFixed(2)}
            </span>
          </div>
          <div className="text-sm">
            <span className={`font-semibold ${product.stock > 5 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {!admin ? (
          <Button
            variant="orange"
            fullWidth
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            loading={addToCartMutation.isPending}
            leftIcon={<FiShoppingCart size={16} />}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-700 px-3 py-2 text-center text-xs text-gray-400">
            Admin view only
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
