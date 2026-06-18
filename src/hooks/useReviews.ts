import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductReviews, upsertReview, deleteReview } from '../api/review.api';
import type { UpsertReviewData } from '../api/review.api';
import toast from 'react-hot-toast';

export const reviewKeys = {
  all:            ['reviews'] as const,
  product:        (productId: string) => ['reviews', productId] as const,
};

export const useReviews = (productId: string) =>
  useQuery({
    queryKey: reviewKeys.product(productId),
    queryFn:  () => getProductReviews(productId),
    enabled:  !!productId,
  });

export const useUpsertReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertReviewData) => upsertReview(productId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.product(productId) });
      toast.success(res.message || 'Review saved!');
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to save review'),
  });
};

export const useDeleteReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(productId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.product(productId) });
      toast.success('Review deleted');
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to delete review'),
  });
};
