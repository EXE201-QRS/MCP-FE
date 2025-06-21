import { z } from "zod";

export const LoginResSchema = z.object({
  data: z.object({ sessionToken: z.string() }),
  message: z.string(),
});

export const SessionTokenBodySchema = z
  .object({
    sessionToken: z.string(),
  })
  .strict();

export const SessionTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  name: z.string(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const LogoutBodySchema = SessionTokenBodySchema;

//type
export type LoginResType = z.infer<typeof LoginResSchema>;
export type SessionTokenType = z.infer<typeof SessionTokenSchema>;
export type SessionTokenBodyType = z.infer<typeof SessionTokenBodySchema>;
export type LogoutBodyType = SessionTokenBodyType;
