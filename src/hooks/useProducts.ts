import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../api';
import type { CreateProductData, UpdateProductData, ProductQueryParams } from '../api/product.api';
import toast from 'react-hot-toast';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to fetch products — passes all params to the server.
 * Empty / undefined params are omitted from the request.
 */
export const useProducts = (params?: ProductQueryParams) => {
  // Strip empty string values so they are not sent as ?search=&category=
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== undefined),
      ) as ProductQueryParams
    : undefined;

  return useQuery({
    queryKey: productKeys.list(cleanParams),
    queryFn:  () => getAllProducts(cleanParams),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new product (admin only)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

/**
 * Hook to update a product (admin only)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

/**
 * Hook to delete a product (admin only)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
