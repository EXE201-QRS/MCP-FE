export const TypeOfVerificationCode = {
  REGISTER: "REGISTER",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
} as const;

export type TypeOfVerificationCodeType =
  (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode];

export const Role = {
  ADMIN_SYSTEM: "ADMIN_SYSTEM",
  CUSTOMER: "CUSTOMER",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
