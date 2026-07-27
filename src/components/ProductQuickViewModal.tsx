import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiX } from 'react-icons/fi';
import type { Product, Category } from '../types';
import { getImageUrl } from '../utils/image';
import Button from './Button';

interface ProductQuickViewModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
  wishlistLoading: boolean;
  addToCartLoading?: boolean;
}

const ProductQuickViewModal = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  wishlistLoading,
  addToCartLoading = false,
}: ProductQuickViewModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedImage(product.images.length > 1 ? 1 : 0);
  }, [isOpen, product.images.length]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const images = product.images.length > 0
    ? product.images.map(img => getImageUrl(img))
    : [getImageUrl(undefined)];

  const category = product.category as Category;
  const selectedImageUrl = images[selectedImage] ?? images[0];

  const stockLabel = product.stock === 0
    ? 'Out of Stock'
    : product.stock <= 5
      ? `Only ${product.stock} left`
      : 'In Stock';

  return (
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between p-5 border-b border-slate-200">
          <div>
            <h2 id="quick-view-title" className="text-xl font-bold text-slate-900">
              {product.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {category?.name || 'Product details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Close quick view"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 p-6">
          <div className="space-y-4">
            <div className="relative rounded-4xl overflow-hidden bg-slate-100 aspect-4/3">
              <img
                src={selectedImageUrl}
                alt={`${product.title} image ${selectedImage + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'; }}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-3xl border transition-all ${
                    selectedImage === index
                      ? 'border-[#10354a] shadow-lg'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=No'; }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl font-bold text-slate-900">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {stockLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  Shipping calculated at checkout.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500 mb-2">Product Info</p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SKU</span>
                    <span className="font-semibold">{product._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Availability</span>
                    <span className="font-semibold">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold">{category?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.24em]">Description</h3>
                <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="orange"
                  size="lg"
                  onClick={onAddToCart}
                  loading={addToCartLoading}
                  disabled={product.stock === 0}
                  leftIcon={<FiShoppingCart size={18} />}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <button
                  type="button"
                  onClick={onToggleWishlist}
                  disabled={wishlistLoading}
                  className={`inline-flex h-14 items-center justify-center gap-2 rounded-3xl border px-4 text-sm font-semibold transition-colors ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <FiHeart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                  {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              <Link
                to={`/products/${product._id}`}
                onClick={onClose}
                className="inline-flex h-14 items-center justify-center rounded-3xl border border-slate-200 bg-transparent text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                View full product page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
