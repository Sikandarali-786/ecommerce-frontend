import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';
import type { ReviewsResponse, Review } from '../types';

export interface UpsertReviewData {
  rating:  number;
  comment: string;
}

interface ReviewMutationResponse {
  success: boolean;
  message: string;
  review:  Review;
}

interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

export const getProductReviews = async (
  productId: string,
): Promise<ReviewsResponse> => {
  const res = await axiosInstance.get<ReviewsResponse>(
    API_ENDPOINTS.REVIEW.GET_ALL(productId),
  );
  return res.data;
};

export const upsertReview = async (
  productId: string,
  data: UpsertReviewData,
): Promise<ReviewMutationResponse> => {
  const res = await axiosInstance.post<ReviewMutationResponse>(
    API_ENDPOINTS.REVIEW.UPSERT(productId),
    data,
  );
  return res.data;
};

export const deleteReview = async (
  productId: string,
  reviewId:  string,
): Promise<DeleteReviewResponse> => {
  const res = await axiosInstance.delete<DeleteReviewResponse>(
    API_ENDPOINTS.REVIEW.DELETE(productId, reviewId),
  );
  return res.data;
};
