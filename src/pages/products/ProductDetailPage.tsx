import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart, FiArrowLeft, FiPackage, FiTag,
  FiMinus, FiPlus, FiHeart,
} from 'react-icons/fi';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useAddToCart } from '../../hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from '../../hooks/useWishlist';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductCard from '../../components/ProductCard';
import Button from '../../components/Button';
import type { Category } from '../../types';
import { useState } from 'react';
import { getImageUrl } from '../../utils/image';
import ReviewSection from '../../components/ReviewSection';
import { isAdmin } from '../../utils/auth';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useProduct(id!);
  const { data: allProductsData } = useProducts();

  const addToCartMutation     = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useIsInWishlist(id!);
  const admin = isAdmin();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ── Loading / Error states ─────────────────────────────────────────────── */
  if (isLoading) return <LoadingSpinner />;

  if (isError || !data?.product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">
            {error instanceof Error ? error.message : 'This product does not exist or has been removed.'}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const product  = data.product;
  const category = product.category as Category;
  const images   = product.images?.length
    ? product.images.map(img => getImageUrl(img))
    : [getImageUrl(null)];

  const maxQty = product.stock;

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => Math.min(maxQty, q + 1));

  const handleAddToCart = () => {
    if (!data?.product) return;
    addToCartMutation.mutate({ productId: product._id, quantity });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product._id);
    } else {
      addToWishlistMutation.mutate({ productId: product._id });
    }
  };

  /* ── Related products — same category, exclude current ─────────────────── */
  const related = (allProductsData?.products ?? [])
    .filter(p => {
      const cat = p.category as Category;
      return p._id !== product._id && cat?._id === category?._id;
    })
    .slice(0, 4);

  /* ── Stock indicator text + colour ─────────────────────────────────────── */
  const stockLabel = product.stock === 0
    ? { text: 'Out of Stock',       color: 'text-red-600 bg-red-50 border-red-200'    }
    : product.stock <= 5
    ? { text: `Only ${product.stock} left`, color: 'text-orange-600 bg-orange-50 border-orange-200' }
    : { text: 'In Stock',           color: 'text-green-700 bg-green-50 border-green-200' };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Back button ─────────────────────────────────────────────── */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<FiArrowLeft size={18} />}
          className="mb-6"
        >
          Back
        </Button>

        {/* ── Main product card ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── Left: images ──────────────────────────────────────────── */}
            <div className="p-6 lg:p-8 bg-gray-50 flex flex-col gap-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'; }}
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                    <span className="text-white text-xl font-bold bg-red-600 px-5 py-2 rounded-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-blue-600 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.src = 'https://placehold.co/100x100?text=No'; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: info ───────────────────────────────────────────── */}
            <div className="p-6 lg:p-8 flex flex-col">

              {/* Category badge */}
              {category && (
                <div className="flex items-center gap-2 mb-3">
                  <FiTag size={14} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {category.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock badge */}
              <span className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-sm font-semibold border mb-6 ${stockLabel.color}`}>
                <FiPackage size={14} />
                {stockLabel.text}
              </span>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {product.description}
                </p>
              </div>

              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="w-9 h-9 px-0!"
                    >
                      <FiMinus size={15} />
                    </Button>
                    <span className="w-12 text-center text-base font-bold text-gray-900">
                      {quantity}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleIncrease}
                      disabled={quantity >= maxQty}
                      className="w-9 h-9 px-0!"
                    >
                      <FiPlus size={15} />
                    </Button>
                    <span className="text-sm text-gray-400">
                      / {product.stock} available
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!admin ? (
                <div className="mt-auto flex gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    loading={addToCartMutation.isPending}
                    leftIcon={<FiShoppingCart size={20} />}
                    className="flex-1"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>

                  <button
                    onClick={handleToggleWishlist}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all disabled:opacity-50 ${
                      isInWishlist
                        ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                        : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500'
                    }`}
                  >
                    <FiHeart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ) : (
                <div className="mt-auto rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-sm text-gray-500">
                  Admin view only
                </div>
              )}

              {/* Delivery note */}
              {product.stock > 0 && (
                <p className="mt-4 text-xs text-gray-400 text-center">
                  🚚 Free shipping on orders over $100
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Product specs table (clean, no raw IDs) ──────────────────── */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Product Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-500">Category</dt>
              <dd className="text-sm font-semibold text-gray-900">{category?.name || '—'}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-500">Availability</dt>
              <dd className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-500">Price</dt>
              <dd className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-500">Condition</dt>
              <dd className="text-sm font-semibold text-gray-900">Brand New</dd>
            </div>
          </dl>
        </div>

        {/* ── Reviews ──────────────────────────────────────────────────── */}
        <ReviewSection productId={product._id} />

        {/* ── Related products ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
              <Link
                to="/products"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
