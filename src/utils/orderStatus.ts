import type { Order } from '../api/order.api';

export const ORDER_STATUSES: Order['orderStatus'][] = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const PAYMENT_STATUSES: Order['paymentStatus'][] = [
  'Pending',
  'Paid',
  'Failed',
];

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Confirmed':
      return 'bg-purple-100 text-purple-800';
    case 'Shipped':
      return 'bg-orange-100 text-orange-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
