import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { ProductsResponse, SingleProductResponse, Product } from '../types';

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  weight?: number;
  originalPrice?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductQueryParams {
  search?:   string;
  category?: string;   // category _id
  minPrice?: string;
  maxPrice?: string;
  sortBy?:   'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | '';
  page?:     number;
  limit?:    number;
}

export interface PaginatedProductsResponse extends ProductsResponse {
  pagination: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
    hasMore:    boolean;
  };
}

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
 * Get all products — supports server-side search, filter, sort, pagination
 */
export const getAllProducts = async (
  params?: ProductQueryParams,
): Promise<PaginatedProductsResponse> => {
  const response = await axiosInstance.get<PaginatedProductsResponse>(
    API_ENDPOINTS.PRODUCT.GET_ALL,
    { params },
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
 * Create a new product (admin only) - with file upload support
 */
export const createProduct = async (data: FormData): Promise<ProductResponse> => {
  const response = await axiosInstance.post<ProductResponse>(
    API_ENDPOINTS.PRODUCT.CREATE,
    data
  );
  return response.data;
};

/**
 * Update a product (admin only) - with file upload support
 */
export const updateProduct = async (
  id: string,
  data: FormData
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
