import http from "@/lib/http";
import {
  ForgotPasswordBodyType,
  GetAccountProfileResType,
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SendOTPBodyType,
  UpdateProfileBodyType,
  UpdateProfileResType,
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
  // Update profile
  updateProfile: (body: UpdateProfileBodyType) =>
    http.put<UpdateProfileResType>("/api/auth/profile", body, {
      baseUrl: "",
    }),
  sUpdateProfile: (body: UpdateProfileBodyType) =>
    http.put<UpdateProfileResType>("/auth/me", body),
  
  // OAuth Google
  getGoogleAuthUrl: () => 
    http.get<{ url: string }>("/auth/google-link"),
};

export default authApiRequest;
