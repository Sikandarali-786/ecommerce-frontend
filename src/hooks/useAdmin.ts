import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from '../api';
import type { UpdateOrderStatusData } from '../api/order.api';
import toast from 'react-hot-toast';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: string) => [...adminKeys.all, 'user', id] as const,
  orders: () => [...adminKeys.all, 'orders'] as const,
};

/**
 * Hook to fetch dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getDashboardStats,
    retry: 1,
  });
};

/**
 * Hook to fetch all users
 */
export const useAllUsers = () => {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: getAllUsers,
    retry: 1,
  });
};

/**
 * Hook to fetch single user
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
    retry: 1,
  });
};

/**
 * Hook to update user role
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'user' | 'admin' }) =>
      updateUserRole(id, role),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(data.user._id) });
      toast.success(data.message || 'User role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    },
  });
};

/**
 * Hook to toggle user block status
 */
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleUserStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(data.user._id) });
      toast.success(data.message || 'User status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    },
  });
};

/**
 * Hook to fetch all orders (admin)
 */
export const useAdminOrders = () => {
  return useQuery({
    queryKey: adminKeys.orders(),
    queryFn: () => getAllOrdersAdmin(),
    retry: 1,
  });
};

/**
 * Hook to update order status (admin)
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusData }) =>
      updateOrderStatusAdmin(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(response.message || 'Order updated successfully');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to update order');
    },
  });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success(data.message || 'User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};
