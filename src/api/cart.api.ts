import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { Product } from '../types';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  total: number;
}

export interface AddToCartData {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartResponse> => {
  const response = await axiosInstance.get<CartResponse>(API_ENDPOINTS.CART.GET);
  return response.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (data: AddToCartData): Promise<CartResponse> => {
  const response = await axiosInstance.post<CartResponse>(
    API_ENDPOINTS.CART.ADD,
    data
  );
  return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (data: UpdateCartItemData): Promise<CartResponse> => {
  const response = await axiosInstance.put<CartResponse>(
    API_ENDPOINTS.CART.UPDATE,
    data
  );
  return response.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId: string): Promise<CartResponse> => {
  const response = await axiosInstance.delete<CartResponse>(
    API_ENDPOINTS.CART.REMOVE(productId)
  );
  return response.data;
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<CartResponse> => {
  const response = await axiosInstance.delete<CartResponse>(
    API_ENDPOINTS.CART.CLEAR
  );
  return response.data;
};
