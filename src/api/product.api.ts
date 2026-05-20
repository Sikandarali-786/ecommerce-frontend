import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { ProductsResponse, SingleProductResponse, Product } from '../types';

interface CreateProductData {
  title: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  category: string;
}

interface UpdateProductData extends Partial<CreateProductData> {}

interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

interface DeleteProductResponse {
  success: boolean;
  message: string;
}

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<ProductsResponse> => {
  const response = await axiosInstance.get<ProductsResponse>(
    API_ENDPOINTS.PRODUCT.GET_ALL
  );
  return response.data;
};

/**
 * Get single product by ID
 */
export const getProductById = async (id: string): Promise<SingleProductResponse> => {
  const response = await axiosInstance.get<SingleProductResponse>(
    API_ENDPOINTS.PRODUCT.GET_BY_ID(id)
  );
  return response.data;
};

/**
 * Create a new product (admin only)
 */
export const createProduct = async (data: CreateProductData): Promise<ProductResponse> => {
  const response = await axiosInstance.post<ProductResponse>(
    API_ENDPOINTS.PRODUCT.CREATE,
    data
  );
  return response.data;
};

/**
 * Update a product (admin only)
 */
export const updateProduct = async (
  id: string,
  data: UpdateProductData
): Promise<ProductResponse> => {
  const response = await axiosInstance.put<ProductResponse>(
    API_ENDPOINTS.PRODUCT.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Delete a product (admin only)
 */
export const deleteProduct = async (id: string): Promise<DeleteProductResponse> => {
  const response = await axiosInstance.delete<DeleteProductResponse>(
    API_ENDPOINTS.PRODUCT.DELETE(id)
  );
  return response.data;
};
