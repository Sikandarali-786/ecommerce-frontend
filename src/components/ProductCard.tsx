import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
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
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const imageUrl = getImageUrl(product.images?.[0]);
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useIsInWishlist(product._id);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCartMutation.mutate({ productId: product._id, quantity: 1 });
  };

  const openQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
  };

  return (
    <>
      <div className="relative rounded-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 shadow-xl bg-linear-to-r from-[#10354a] to-[#cf531f] text-white">
      {/* Price badge (top-right) */}

      <div className="relative h-56 flex items-center justify-center bg-linear-to-b from-transparent to-black/20">
        {/* Glow behind image using orange/orange-red like the design */}
        <div className="absolute w-40 h-40 rounded-full opacity-70 bg-linear-to-r from-[#ff7a1a] to-[#cf531f] blur-3xl" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/10">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openQuickView}
            className="group relative inline-flex h-10 min-w-32.5 items-center justify-center rounded-full border border-white/20 bg-transparent px-4 text-white transition-all duration-300 ease-out hover:border-white hover:bg-white/10"
          >
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0">
              Quick view
            </span>
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 text-white">
              <FiEye size={18} />
            </span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="group relative inline-flex h-10 min-w-32.5 items-center justify-center rounded-full border border-white/20 bg-transparent text-white px-4 font-semibold transition-all duration-300 ease-out hover:border-white hover:bg-white/10"
          >
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0">
              Add to cart
            </span>
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 text-white">
              <FiShoppingCart size={18} />
            </span>
          </Button>
        </div>

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

      <div className="p-4 bg-transparent">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-blue-300 transition-colors line-clamp-2 mb-2 min-h-14">
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
