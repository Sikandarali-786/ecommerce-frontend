import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { Order } from './order.api';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface OrdersByStatus {
  _id: string;
  count: number;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentOrders: Order[];
  ordersByStatus: OrdersByStatus[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  totalUsers: number;
}

export interface UserResponse {
  success: boolean;
  user: User;
  message?: string;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardResponse> => {
  const response = await axiosInstance.get<DashboardResponse>(
    API_ENDPOINTS.USER.ADMIN_STATS
  );
  return response.data;
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (): Promise<UsersResponse> => {
  const response = await axiosInstance.get<UsersResponse>(
    API_ENDPOINTS.USER.ADMIN_USERS
  );
  return response.data;
};

/**
 * Get user by ID (Admin only)
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>(
    API_ENDPOINTS.USER.ADMIN_USER_BY_ID(id)
  );
  return response.data;
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (
  id: string,
  role: 'user' | 'admin'
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
    API_ENDPOINTS.USER.ADMIN_UPDATE_ROLE(id),
    { role }
  );
  return response.data;
};

/**
 * Toggle user block status (Admin only)
 */
export const toggleUserStatus = async (id: string): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
    API_ENDPOINTS.USER.ADMIN_TOGGLE_STATUS(id)
  );
  return response.data;
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete<{ success: boolean; message: string }>(
    API_ENDPOINTS.USER.ADMIN_DELETE_USER(id)
  );
  return response.data;
};
