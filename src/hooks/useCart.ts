import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../api';
import type { AddToCartData, UpdateCartItemData } from '../api';
import toast from 'react-hot-toast';
import { isAuthenticated } from '../utils/auth';

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

/**
 * Hook to fetch user's cart
 */
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: getCart,
    enabled: isAuthenticated(), // Only fetch if user is logged in
    retry: 1,
  });
};

/**
 * Hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AddToCartData) => {
      if (!isAuthenticated()) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        throw new Error('Not authenticated');
      }
      return addToCart(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Item added to cart');
    },
    onError: (error: any) => {
      if (error.message !== 'Not authenticated') {
        toast.error(error.response?.data?.message || 'Failed to add item to cart');
      }
    },
  });
};

/**
 * Hook to update cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartItemData) => updateCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Cart updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
  });
};

/**
 * Hook to remove item from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });
};

/**
 * Hook to clear cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Cart cleared');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    },
  });
};
