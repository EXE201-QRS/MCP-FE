import http from "@/lib/http";
import {
  AdminResponseReviewBodyType,
  CreateReviewBodyType,
  GetReviewDetailResType,
  GetReviewDetailResWithFullType,
  GetReviewesResType,
  GetReviewQueryType,
  UpdateReviewBodyType,
} from "@/schemaValidations/review.model";

const prefix = "/reviews";
const reviewApiRequests = {
  // List reviews with filters
  list: (params?: Partial<GetReviewQueryType>) =>
    http.getList<GetReviewesResType>(`${prefix}`, { params }),
  
  // Get public reviews for landing page
  getPublicReviews: (params?: Partial<GetReviewQueryType>) =>
    http.getList<GetReviewesResType>(`${prefix}/public`, { params }),
  
  // Get pending reviews for admin
  getPendingReviews: (params?: Partial<GetReviewQueryType>) =>
    http.getList<GetReviewesResType>(`${prefix}/admin/pending`, { params }),
  
  // CRUD operations
  addReview: (body: CreateReviewBodyType) =>
    http.post<GetReviewDetailResType>(prefix, body),
  
  updateReview: (id: number, body: UpdateReviewBodyType) =>
    http.put<GetReviewDetailResType>(`${prefix}/${id}`, body),
  
  getReview: (id: number) =>
    http.get<GetReviewDetailResWithFullType>(`${prefix}/${id}`),
  
  deleteReview: (id: number) => 
    http.delete(`${prefix}/${id}`),
  
  // Admin operations
  adminResponse: (id: number, body: AdminResponseReviewBodyType) =>
    http.put<GetReviewDetailResType>(`${prefix}/${id}/admin-response`, body),
  
  togglePublic: (id: number) =>
    http.put<GetReviewDetailResType>(`${prefix}/${id}/toggle-public`, {}),
};
export default reviewApiRequests;
