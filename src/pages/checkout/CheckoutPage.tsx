import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiShoppingCart, FiCreditCard, FiTruck } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useCreateOrder } from '../../hooks/useOrders';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { checkoutSchema, type CheckoutFormData } from '../../schemas/checkout.schema';
import { getImageUrl } from '../../utils/image';
import Button from '../../components/Button';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useCart();
  const createOrderMutation = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Advance Payment'>('COD');

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
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          }
        />
      </div>
    );
  }

  const shippingCost = total > 100 ? 0 : total * 0.1; // 10% shipping when subtotal <= 100
  const discount = paymentMethod === 'Advance Payment' ? total * 0.01 : 0;
  const grandTotal = Math.max(0, total + shippingCost - discount);

  const onSubmit = async (formData: CheckoutFormData) => {
    const orderData = {
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      },
      paymentMethod,
      subtotal: total,
      shippingCost,
      discount,
      tax: 0,
      total: grandTotal,
    };

    createOrderMutation.mutate(orderData);
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
                      className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your full name"
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
                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your email"
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
                      className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your phone number"
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
                      className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Pakistan"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      {...register('address')}
                      type="text"
                      className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code * (Optional)
                    </label>
                    <input
                      {...register('zipCode')}
                      type="text"
                      className={`w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <FiCreditCard className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Advance Payment' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Advance Payment"
                      checked={paymentMethod === 'Advance Payment'}
                      onChange={() => setPaymentMethod('Advance Payment')}
                      className="w-4 h-4 text-emerald-600 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">Advance Payment / EasyPaisa</p>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                          🎉 1% DISCOUNT
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Pay via EasyPaisa / Bank Transfer & get 1% discount</p>
                    </div>
                  </label>

                  {paymentMethod === 'Advance Payment' && (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 mt-3">
                      <p className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
                        <span>📱 EasyPaisa Payment Details</span>
                      </p>
                      <div className="space-y-1.5 text-xs bg-white p-3 rounded border border-emerald-200 shadow-sm text-gray-800">
                        <p><span className="font-semibold text-gray-600">Account Title:</span> <span className="font-bold text-gray-900">Afzal Bikerz Store</span></p>
                        <p><span className="font-semibold text-gray-600">EasyPaisa No:</span> <span className="font-bold text-emerald-700 font-mono text-sm">03048405899</span> / <span className="font-bold text-emerald-700 font-mono text-sm">03700780090</span></p>
                      </div>
                      <p className="text-xs text-emerald-800 mt-2 leading-relaxed">
                        👉 Payment transfer karne ke baad screenshot humare WhatsApp <strong>(0304-8405899)</strong> par bhej dein.
                      </p>
                    </div>
                  )}
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
                    const imageUrl = getImageUrl(item.product.images?.[0]);

                    return (
                      <div key={item._id} className="flex space-x-3">
                        <img
                          src={imageUrl}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/80x80?text=No+Img';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {(item.product.price * item.quantity).toFixed(2)}
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
                    <span className="font-semibold">{total.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>1% Advance Discount</span>
                      <span>-{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping {shippingCost === 0 ? '' : '(10%)'}</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? 'FREE' : shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {total < 100 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Add {(100 - total).toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={createOrderMutation.isPending}
                  className="mt-6"
                >
                  {`Place Order — ${grandTotal.toFixed(2)}`}
                </Button>

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
