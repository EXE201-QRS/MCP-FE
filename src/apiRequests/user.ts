import http from "@/lib/http";
import {
  CreateUserBodyType,
  CreateUserResType,
  GetUserProfileResType,
  GetUsersResType,
  UpdateUserBodyType,
  UpdateUserResType,
} from "@/schemaValidations/user.model";

const prefix = "/users";
const userApiRequests = {
  list: (params?: { page?: number; limit?: number }) =>
    http.getList<GetUsersResType>(`${prefix}`, { params }),
  addUser: (body: CreateUserBodyType) =>
    http.post<CreateUserResType>(prefix, body),
  updateUser: (id: number, body: UpdateUserBodyType) =>
    http.put<UpdateUserResType>(`${prefix}/${id}`, body),
  getUser: (id: number) => http.get<GetUserProfileResType>(`${prefix}/${id}`),
  deleteUser: (id: number) => http.delete(`${prefix}/${id}`),
};
export default userApiRequests;
