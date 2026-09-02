import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiHeart, FiPackage, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAddToCart } from '../hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from '../hooks/useWishlist';
import type { Product } from '../types';
import { getImageUrl } from '../utils/image';
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

  const handleToggleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product._id);
    } else {
      addToWishlistMutation.mutate({ productId: product._id });
    }
  };

  const openQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
  };

  // Get category display title
  const categoryName = typeof product.category === 'object' && product.category
    ? product.category.name
    : typeof product.category === 'string'
      ? product.category
      : 'Afzal Genuine';

  const productWeight = product.weight ?? 1;

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#10354a]/30 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col overflow-hidden cursor-pointer"
      >
        {/* Top Badges & Wishlist Bar */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
          {/* Stock & Discount Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.stock === 0 ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-xs">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                Only {product.stock} Left
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white shadow-xs backdrop-blur-md">
                In Stock
              </span>
            )}

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white shadow-sm animate-pulse">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
            className="pointer-events-auto flex items-center justify-center w-8.5 h-8.5 rounded-full bg-white/90 text-slate-600 hover:text-red-500 shadow-md backdrop-blur-md hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <FaHeart size={15} className="text-red-500 animate-in zoom-in-75 duration-200" />
            ) : (
              <FiHeart size={16} />
            )}
          </button>
        </div>

        {/* Product Image Container */}
        <div className="relative h-52 w-full flex items-center justify-center bg-slate-50/50 p-6 overflow-hidden">
          {/* Quick View Button overlay on hover */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={openQuickView}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-slate-900 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
            >
              <FiEye size={14} /> Quick View
            </button>
          </div>

          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain transform group-hover:scale-108 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/300x300?text=No+Image';
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
          <div>
            {/* Category & Weight Tags */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
              <span className="uppercase tracking-wider font-bold text-[11px] text-[#cf531f] truncate max-w-[65%]">
                {categoryName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                <FiPackage size={11} className="text-[#10354a]" />
                {productWeight} KG
              </span>
            </div>

            {/* Product Title */}
            <Link
              to={`/products/${product._id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-bold text-slate-800 hover:text-[#10354a] transition-colors line-clamp-2 leading-snug min-h-10">
                {product.title}
              </h3>
            </Link>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                <FiStar size={13} className="fill-amber-400" />
                <FiStar size={13} className="fill-amber-400" />
                <FiStar size={13} className="fill-amber-400" />
                <FiStar size={13} className="fill-amber-400" />
                <FiStar size={13} className="fill-amber-400/40" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">4.8 (24)</span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-semibold text-slate-400 line-through">
                    PKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCartMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#10354a] to-[#cf531f] text-white text-xs font-bold hover:opacity-95 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 shrink-0"
              title="Add to cart"
            >
              <FiShoppingCart size={15} />
              <span>{addToCartMutation.isPending ? 'Adding…' : 'Add'}</span>
            </button>
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
