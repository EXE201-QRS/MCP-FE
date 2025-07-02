import { TypeOfVerificationCode } from "@/constants/auth.constant";
import { UserSchema } from "@/schemaValidations/user.model";
import { z } from "zod";

export const UpdateProfileBodySchema = z
  .object({
    name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên không được quá 100 ký tự"),
    phoneNumber: z.string().min(9, "Số điện thoại phải có ít nhất 9 số").max(15, "Số điện thoại không được quá 15 số"),
  })
  .strict();

export const UpdateProfileResSchema = z.object({
  data: UserSchema.pick({
    id: true,
    email: true,
    name: true,
    phoneNumber: true,
    avatar: true,
  }),
  message: z.string(),
});

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict();

export const LoginResSchema = z.object({
  data: z.object({ sessionToken: z.string() }),
  message: z.string(),
});

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and confirm password must match",
        path: ["confirmPassword"],
      });
    }
  });

export const RegisterResSchema = LoginResSchema;

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    TypeOfVerificationCode.REGISTER,
    TypeOfVerificationCode.FORGOT_PASSWORD,
  ]),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu và mật khẩu xác nhận phải giống nhau",
        path: ["confirmNewPassword"],
      });
    }
  });

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict();

export const GetAccountProfileResSchema = z.object({
  data: UserSchema.omit({ password: true }),
  message: z.string(),
});

//type
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;
export type RegisterResType = z.infer<typeof RegisterResSchema>;
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type LoginResType = z.infer<typeof LoginResSchema>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>;
export type GetAccountProfileResType = z.infer<
  typeof GetAccountProfileResSchema
>;
export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>;
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>;
