import http from "@/lib/http";
import {
  CreateSubscriptionBodyType,
  GetSubscriptionDetailResType,
  GetSubscriptionsResType,
  UpdateSubscriptionBodyType,
} from "@/schemaValidations/subscription.model";

const prefix = "/subscriptions";
const subscriptionApiRequests = {
  list: (params?: { page?: number; limit?: number }) =>
    http.getList<GetSubscriptionsResType>(`${prefix}`, { params }),
  // Admin endpoint to get all subscriptions
  adminListAll: (params?: { page?: number; limit?: number }) =>
    http.getList<GetSubscriptionsResType>(`${prefix}/admin/all`, { params }),
  addSubscription: (body: CreateSubscriptionBodyType) =>
    http.post<GetSubscriptionDetailResType>(prefix, body),
  updateSubscription: (id: number, body: UpdateSubscriptionBodyType) =>
    http.put<GetSubscriptionDetailResType>(`${prefix}/${id}`, body),
  getSubscription: (id: number) =>
    http.get<GetSubscriptionDetailResType>(`${prefix}/${id}`),
  deleteSubscription: (id: number) => http.delete(`${prefix}/${id}`),
};

export default subscriptionApiRequests;
