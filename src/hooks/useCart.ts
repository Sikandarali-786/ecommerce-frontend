import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../api';
import type { AddToCartData, UpdateCartItemData } from '../api';
import toast from 'react-hot-toast';

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
    retry: 1,
  });
};

/**
 * Hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartData) => addToCart(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success(data.message || 'Item added to cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success(data.message || 'Cart updated');
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success(data.message || 'Item removed from cart');
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success(data.message || 'Cart cleared');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    },
  });
};
