import api from '../../services/api';

export interface Review {
  id: number;
  student_id: number;
  owner_id: number;
  property_id: number | null;
  rating: number;
  comment: string | null;
  created_at: string;
  student_name: string;
}

export interface ReviewsSummary {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const getOwnerReviews = async (ownerId: number) =>
  (await api.get<ReviewsSummary>(`/reviews/owner/${ownerId}`)).data;

export const getPropertyReviews = async (propertyId: number) =>
  (await api.get<ReviewsSummary>(`/reviews/property/${propertyId}`)).data;

export const getMyReviews = async () => (await api.get<(Review & { owner_name: string })[]>('/reviews/mine')).data;

export const canReviewOwner = async (ownerId: number) =>
  (await api.get<{ canReview: boolean; alreadyReviewed: boolean; unlocked: boolean }>(`/reviews/can-review/${ownerId}`))
    .data;

export const createReview = async (payload: { owner_id: number; property_id?: number; rating: number; comment?: string }) =>
  (await api.post<Review>('/reviews', payload)).data;
