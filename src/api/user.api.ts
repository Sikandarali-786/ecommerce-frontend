import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { User } from '../types';

interface UserProfileResponse {
  success: boolean;
  user: User;
}

interface AdminResponse {
  success: boolean;
  message: string;
}

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await axiosInstance.get<UserProfileResponse>(
    API_ENDPOINTS.USER.PROFILE
  );
  return response.data;
};

/**
 * Access admin panel (admin only)
 */
export const getAdminAccess = async (): Promise<AdminResponse> => {
  const response = await axiosInstance.get<AdminResponse>(
    API_ENDPOINTS.USER.ADMIN
  );
  return response.data;
};
