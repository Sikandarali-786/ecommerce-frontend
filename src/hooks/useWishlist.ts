import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../api';
import type { AddToWishlistData } from '../api';
import toast from 'react-hot-toast';
import { isAuthenticated } from '../utils/auth';

// Query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  detail: () => [...wishlistKeys.all, 'detail'] as const,
};

/**
 * Hook to fetch user's wishlist
 */
export const useWishlist = () => {
  return useQuery({
    queryKey: wishlistKeys.detail(),
    queryFn: getWishlist,
    enabled: isAuthenticated(), // Only fetch if user is logged in
    retry: 1,
  });
};

/**
 * Hook to add product to wishlist
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AddToWishlistData) => {
      if (!isAuthenticated()) {
        toast.error('Please login to add items to wishlist');
        navigate('/login');
        throw new Error('Not authenticated');
      }
      return addToWishlist(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Added to wishlist');
    },
    onError: (error: any) => {
      if (error.message !== 'Not authenticated') {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    },
  });
};

/**
 * Hook to remove product from wishlist
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    },
  });
};

/**
 * Hook to clear wishlist
 */
export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Wishlist cleared');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear wishlist');
    },
  });
};

/**
 * Hook to check if product is in wishlist
 */
export const useIsInWishlist = (productId: string) => {
  const { data } = useWishlist();
  return data?.wishlist?.products?.some(product => product._id === productId) || false;
};
