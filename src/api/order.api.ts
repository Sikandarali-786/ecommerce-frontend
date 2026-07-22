import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';

export interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: 'COD' | 'Card' | 'PayPal';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  orderDate: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingInfo: ShippingInfo;
  paymentMethod?: 'COD' | 'Card' | 'PayPal';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

/**
 * Create new order
 */
export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  const response = await axiosInstance.post<OrderResponse>(
    API_ENDPOINTS.ORDER.CREATE,
    data
  );
  return response.data;
};

/**
 * Get user's orders
 */
export const getUserOrders = async (): Promise<OrdersResponse> => {
  const response = await axiosInstance.get<OrdersResponse>(
    API_ENDPOINTS.ORDER.MY_ORDERS
  );
  return response.data;
};

/**
 * Get single order by ID
 */
export const getOrderById = async (id: string): Promise<OrderResponse> => {
  const response = await axiosInstance.get<OrderResponse>(
    API_ENDPOINTS.ORDER.GET_BY_ID(id)
  );
  return response.data;
};

/**
 * Cancel order
 */
export const cancelOrder = async (id: string): Promise<OrderResponse> => {
  const response = await axiosInstance.put<OrderResponse>(
    API_ENDPOINTS.ORDER.CANCEL(id)
  );
  return response.data;
};

export interface AdminOrdersResponse {
  success: boolean;
  orders: Order[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  totalRevenue?: number;
}

export interface UpdateOrderStatusData {
  orderStatus?: Order['orderStatus'];
  paymentStatus?: Order['paymentStatus'];
}

/**
 * Get all orders (admin only)
 */
export interface AdminOrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const getAllOrdersAdmin = async (
  params?: AdminOrdersQueryParams,
): Promise<AdminOrdersResponse> => {
  const response = await axiosInstance.get<AdminOrdersResponse>(
    API_ENDPOINTS.ORDER.ADMIN_GET_ALL,
    { params },
  );
  return response.data;
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatusAdmin = async (
  id: string,
  data: UpdateOrderStatusData
): Promise<OrderResponse> => {
  const response = await axiosInstance.put<OrderResponse>(
    API_ENDPOINTS.ORDER.ADMIN_UPDATE_STATUS(id),
    data
  );
  return response.data;
};
