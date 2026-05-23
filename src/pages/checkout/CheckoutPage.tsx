import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiShoppingCart, FiCreditCard, FiTruck, FiLock } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { checkoutSchema, type CheckoutFormData } from '../../schemas/checkout.schema';
import type { Category } from '../../types';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const cart = data?.cart;
  const total = data?.total || 0;
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<FiShoppingCart />}
          title="Your cart is empty"
          description="Add some products to your cart before checkout"
          action={
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          }
        />
      </div>
    );
  }

  const shippingCost = total > 100 ? 0 : 10;
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + shippingCost + tax;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Order placed successfully!');
      console.log('Order data:', { ...data, items, total: grandTotal });
      
      // In a real app, you would send this to your backend
      // await createOrder({ ...data, items, total: grandTotal });
      
      navigate('/order-success');
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <FiTruck className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      {...register('fullName')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      {...register('country')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="United States"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      {...register('address')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code *
                    </label>
                    <input
                      {...register('zipCode')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <FiCreditCard className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      {...register('cardNumber')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      {...register('cardName')}
                      type="text"
                      className={`w-full px-3 py-2 border ${
                        errors.cardName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        {...register('expiryDate')}
                        type="text"
                        className={`w-full px-3 py-2 border ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        {...register('cvv')}
                        type="text"
                        className={`w-full px-3 py-2 border ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <FiLock className="text-blue-600" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const category = item.product.category as Category;
                    const imageUrl = item.product.images?.[0] || 'https://via.placeholder.com/80x80';

                    return (
                      <div key={item._id} className="flex space-x-3">
                        <img
                          src={imageUrl}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {total < 100 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Add ${(100 - total).toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Place Order - $${grandTotal.toFixed(2)}`}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
