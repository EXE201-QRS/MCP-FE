import http from "@/lib/http";
import {
  CreateServicePlanBodyType,
  GetServicePlanDetailResType,
  GetServicePlansResType,
  UpdateServicePlanBodyType,
} from "@/schemaValidations/service-plan.model";

const prefix = "/service-plans";
const servicePlanApiRequests = {
  list: (params?: { page?: number; limit?: number }) =>
    http.getList<GetServicePlansResType>(`${prefix}`, { params }),
  addServicePlan: (body: CreateServicePlanBodyType) =>
    http.post<GetServicePlanDetailResType>(prefix, body),
  updateServicePlan: (id: number, body: UpdateServicePlanBodyType) =>
    http.put<GetServicePlanDetailResType>(`${prefix}/${id}`, body),
  getServicePlan: (id: number) =>
    http.get<GetServicePlanDetailResType>(`${prefix}/${id}`),
  deleteServicePlan: (id: number) => http.delete(`${prefix}/${id}`),
};

export default servicePlanApiRequests;
