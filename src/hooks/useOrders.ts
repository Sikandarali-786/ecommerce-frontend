import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createOrder, getUserOrders, getOrderById, cancelOrder } from '../api';
import type { CreateOrderData } from '../api/order.api';
import toast from 'react-hot-toast';
import { isAuthenticated } from '../utils/auth';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Hook to fetch user's orders
 */
export const useOrders = () => {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: getUserOrders,
    enabled: isAuthenticated(),
    retry: 1,
  });
};

/**
 * Hook to fetch single order
 */
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id && isAuthenticated(),
    retry: 1,
  });
};

/**
 * Hook to create order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateOrderData) => {
      if (!isAuthenticated()) {
        toast.error('Please login to place an order');
        navigate('/login');
        throw new Error('Not authenticated');
      }
      return createOrder(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Invalidate products so stock counts reflect the new order
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(data.message || 'Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    },
    onError: (error: any) => {
      if (error.message !== 'Not authenticated') {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    },
  });
};

/**
 * Hook to cancel order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.order._id) });
      toast.success(data.message || 'Order cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
};
