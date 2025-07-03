import http from "@/lib/http";
import {
  ChangePasswordBodyType,
  CreateUserBodyType,
  CreateUserResType,
  GetUserProfileResType,
  GetUsersResType,
  UpdateUserBodyType,
  UpdateUserResType,
} from "@/schemaValidations/user.model";

const prefix = "/users";
const userApiRequests = {
  list: (params?: { page?: number; limit?: number; role?: string }) =>
    http.getList<GetUsersResType>(`${prefix}`, { params }),
  addUser: (body: CreateUserBodyType) =>
    http.post<CreateUserResType>(prefix, body),
  updateUser: (id: number, body: UpdateUserBodyType) =>
    http.put<UpdateUserResType>(`${prefix}/${id}`, body),
  getUser: (id: number) => http.get<GetUserProfileResType>(`${prefix}/${id}`),
  deleteUser: (id: number) => http.delete(`${prefix}/${id}`),
  //Change Password
  changePassword: (body: ChangePasswordBodyType) =>
    http.put(`${prefix}/change-password`, body),
};
export default userApiRequests;
