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

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  devResetToken?: string; // only present in dev/demo mode
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Request a password reset link
 */
export const forgotPassword = async (
  email: string,
): Promise<ForgotPasswordResponse> => {
  const response = await axiosInstance.post<ForgotPasswordResponse>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    { email },
  );
  return response.data;
};

/**
 * Reset password using the token from the reset link
 */
export const resetPassword = async (
  token: string,
  password: string,
): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD(token),
    { password },
  );
  return response.data;
};
