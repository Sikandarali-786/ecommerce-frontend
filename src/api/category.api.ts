import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { CategoriesResponse, Category } from '../types';

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
export const createCategory = async (data: FormData): Promise<CreateCategoryResponse> => {
  const response = await axiosInstance.post<CreateCategoryResponse>(
    API_ENDPOINTS.CATEGORY.CREATE,
    data
  );
  return response.data;
};

interface CategoryMutationResponse {
  success: boolean;
  message: string;
  category?: Category;
}

/**
 * Update a category (admin only)
 */
export const updateCategory = async (
  id: string,
  data: FormData
): Promise<CategoryMutationResponse> => {
  const response = await axiosInstance.put<CategoryMutationResponse>(
    API_ENDPOINTS.CATEGORY.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Delete a category (admin only)
 */
export const deleteCategory = async (id: string): Promise<CategoryMutationResponse> => {
  const response = await axiosInstance.delete<CategoryMutationResponse>(
    API_ENDPOINTS.CATEGORY.DELETE(id)
  );
  return response.data;
};
