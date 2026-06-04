import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { User } from '../types';

interface UserProfileResponse {
  success: boolean;
  user: User;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface MessageResponse {
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
 * Update profile (name / email)
 */
export const updateUserProfile = async (data: UpdateProfileData): Promise<UserProfileResponse> => {
  const response = await axiosInstance.put<UserProfileResponse>(
    API_ENDPOINTS.USER.UPDATE_PROFILE,
    data
  );
  return response.data;
};

/**
 * Change password
 */
export const changeUserPassword = async (data: ChangePasswordData): Promise<MessageResponse> => {
  const response = await axiosInstance.put<MessageResponse>(
    API_ENDPOINTS.USER.CHANGE_PASSWORD,
    data
  );
  return response.data;
};
