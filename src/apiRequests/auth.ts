import http from "@/lib/http";
import {
  ForgotPasswordBodyType,
  GetAccountProfileResType,
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SendOTPBodyType,
} from "@/schemaValidations/auth.model";

const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  sRegister: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/auth/register", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/api/auth/register", body, {
      baseUrl: "",
    }),
  sendOTP: (body: SendOTPBodyType) => http.post(`auth/otp`, body),
  forgotPassword: (body: ForgotPasswordBodyType) =>
    http.post(`auth/forgot-password`, body),
  //me
  me: () => http.get<GetAccountProfileResType>("/api/auth/me", { baseUrl: "" }),
  sMe: (sessionToken: string) =>
    http.get<GetAccountProfileResType>("/auth/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default authApiRequest;
