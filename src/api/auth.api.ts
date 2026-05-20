import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

/**
 * Register a new user
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    credentials
  );
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return response.data;
};
