import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiPackage, FiTag } from 'react-icons/fi';
import { useProduct } from '../../hooks/useProducts';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Category } from '../../types';
import { useState } from 'react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useProduct(id!);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data?.product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'The product you are looking for does not exist.'}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const product = data.product;
  const category = product.category as Category;
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600x600?text=No+Image'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
                    }}
                  />
                </div>
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-2xl font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150x150?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              {category && (
                <div className="flex items-center space-x-2 mb-4">
                  <FiTag className="text-blue-600" />
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {category.name}
                  </span>
                </div>
              )}

              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Info */}
              <div className="flex items-center space-x-2 mb-6">
                <FiPackage className="text-gray-600" />
                <span className="text-gray-700">
                  {product.stock > 0 ? (
                    <>
                      <span className={`font-semibold ${product.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>{' '}
                      in stock
                      {product.stock <= 5 && <span className="text-orange-600 ml-2">(Low stock!)</span>}
                    </>
                  ) : (
                    <span className="font-semibold text-red-600">Out of stock</span>
                  )}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-auto">
                <button
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart size={24} />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Product Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b pb-3">
              <span className="text-gray-600">Product ID:</span>
              <span className="ml-2 font-semibold text-gray-900">{product._id}</span>
            </div>
            <div className="border-b pb-3">
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-semibold text-gray-900">
                {category?.name || 'N/A'}
              </span>
            </div>
            <div className="border-b pb-3">
              <span className="text-gray-600">Availability:</span>
              <span className={`ml-2 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="border-b pb-3">
              <span className="text-gray-600">Stock Quantity:</span>
              <span className="ml-2 font-semibold text-gray-900">{product.stock}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
