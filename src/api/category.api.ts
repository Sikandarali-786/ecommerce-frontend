import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { CategoriesResponse, Category } from '../types';

interface CreateCategoryData {
  name: string;
  slug: string;
}

interface CreateCategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}

/**
 * Get all categories
 */
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await axiosInstance.get<CategoriesResponse>(
    API_ENDPOINTS.CATEGORY.GET_ALL
  );
  return response.data;
};

/**
 * Create a new category (admin only)
 */
export const createCategory = async (data: CreateCategoryData): Promise<CreateCategoryResponse> => {
  const response = await axiosInstance.post<CreateCategoryResponse>(
    API_ENDPOINTS.CATEGORY.CREATE,
    data
  );
  return response.data;
};
