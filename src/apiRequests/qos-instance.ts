import http from "@/lib/http";
import {
  CreateQosInstanceBodyType,
  GetQosInstanceDetailResType,
  GetQosInstanceDetailResWithFullType,
  GetQosInstanceesResType,
  UpdateQosInstanceBodyType,
} from "@/schemaValidations/qos-instance.model";

const prefix = "/qos-instances";
const qosInstanceApiRequests = {
  list: (params?: { page?: number; limit?: number }) =>
    http.getList<GetQosInstanceesResType>(`${prefix}`, { params }),
  addQosInstance: (body: CreateQosInstanceBodyType) =>
    http.post<GetQosInstanceDetailResType>(prefix, body),
  updateQosInstance: (id: number, body: UpdateQosInstanceBodyType) =>
    http.put<GetQosInstanceDetailResType>(`${prefix}/${id}`, body),
  getQosInstance: (id: number) =>
    http.get<GetQosInstanceDetailResWithFullType>(`${prefix}/${id}`),
  deleteQosInstance: (id: number) => http.delete(`${prefix}/${id}`),
};
export default qosInstanceApiRequests;
