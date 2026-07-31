import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useAddToCart } from '../hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from '../hooks/useWishlist';
import type { Product } from '../types';
import { getImageUrl } from '../utils/image';
import Button from './Button';
import ProductQuickViewModal from './ProductQuickViewModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const imageUrl = getImageUrl(product.images?.[0]);
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useIsInWishlist(product._id);

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    addToCartMutation.mutate({ productId: product._id, quantity: 1 });
    navigate('/cart');
  };

  const openQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative rounded-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 shadow-md border border-slate-200 flex flex-col cursor-pointer"
      >
        {/* Image Container (White Background) */}
        <div className="relative h-56 flex items-center justify-center bg-white p-4 group overflow-hidden">
          
          {/* Hover overlay with action buttons */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openQuickView}
              className="group/btn relative inline-flex h-10 min-w-32.5 items-center justify-center rounded-full border border-white bg-black/60 px-4 text-white font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:border-white cursor-pointer"
            >
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover/btn:opacity-0">
                Quick view
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover/btn:opacity-100 text-black">
                <FiEye size={18} className="text-black" />
              </span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="group/btn relative inline-flex h-10 min-w-32.5 items-center justify-center rounded-full border border-white bg-black/60 px-4 text-white font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-50 cursor-pointer"
            >
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover/btn:opacity-0">
                Add to cart
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover/btn:opacity-100 text-black">
                <FiShoppingCart size={18} className="text-black" />
              </span>
            </Button>
          </div>

          <img
            src={imageUrl}
            alt={product.title}
            className="relative w-44 h-44 object-contain transform transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/300x300?text=No+Image';
            }}
          />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center">
              <span className="text-white text-sm font-semibold bg-red-600 px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2 z-30 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Content Section (Gradient Background) */}
        <div className="p-4 bg-linear-to-r from-[#10354a] to-[#cf531f] text-white flex-1">
          <Link
            to={`/products/${product._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white hover:text-orange-200 transition-colors line-clamp-2 mb-2 min-h-14">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {product.price.toFixed(2)}
            </span>
            {product.stock === 0 ? (
              <span className="text-xs font-semibold text-red-200 bg-red-500/20 px-2 py-1 rounded-full">
                Out of stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-xs font-semibold text-orange-200 bg-orange-500/20 px-2 py-1 rounded-full">
                Only {product.stock} left
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <ProductQuickViewModal
        isOpen={quickViewOpen}
        product={product}
        onClose={closeQuickView}
        onAddToCart={() => addToCartMutation.mutate({ productId: product._id, quantity: 1 })}
        onToggleWishlist={() => {
          if (isInWishlist) {
            removeFromWishlistMutation.mutate(product._id);
          } else {
            addToWishlistMutation.mutate({ productId: product._id });
          }
        }}
        isInWishlist={isInWishlist}
        wishlistLoading={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
        addToCartLoading={addToCartMutation.isPending}
      />
    </>
  );
};

export default ProductCard;
