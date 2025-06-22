import { Role } from "@/constants/auth.constant";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100).nullable(),
  roleName: z.enum([Role.ADMIN_SYSTEM, Role.CUSTOMER]).default(Role.CUSTOMER),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().min(9).max(15).nullable(),
  avatar: z.string().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

//type
export type UserType = z.infer<typeof UserSchema>;
