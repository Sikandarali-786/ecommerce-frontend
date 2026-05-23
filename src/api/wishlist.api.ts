import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { Product } from '../types';

export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  wishlist: Wishlist;
  message?: string;
}

export interface AddToWishlistData {
  productId: string;
}

/**
 * Get user's wishlist
 */
export const getWishlist = async (): Promise<WishlistResponse> => {
  const response = await axiosInstance.get<WishlistResponse>(API_ENDPOINTS.WISHLIST.GET);
  return response.data;
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (data: AddToWishlistData): Promise<WishlistResponse> => {
  const response = await axiosInstance.post<WishlistResponse>(
    API_ENDPOINTS.WISHLIST.ADD,
    data
  );
  return response.data;
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (productId: string): Promise<WishlistResponse> => {
  const response = await axiosInstance.delete<WishlistResponse>(
    API_ENDPOINTS.WISHLIST.REMOVE(productId)
  );
  return response.data;
};

/**
 * Clear wishlist
 */
export const clearWishlist = async (): Promise<WishlistResponse> => {
  const response = await axiosInstance.delete<WishlistResponse>(
    API_ENDPOINTS.WISHLIST.CLEAR
  );
  return response.data;
};
