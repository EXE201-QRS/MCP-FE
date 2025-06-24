import { z } from "zod";

export const PaymentSchema = z
  .object({
    id: z.number(),
    userId: z.number(),
    subscriptionId: z.number(),
    paymentMethod: z.enum(["BANK_TRANSFER"]),
    amount: z.number().min(0),
    status: z.enum([
      "PENDING",
      "PROCESSING",
      "PAID",
      "FAILED",
      "CANCELLED",
      "EXPIRED",
      "REFUNDED",
    ]),
    payosOrderId: z.string().nullable(),
    payosPaymentLinkId: z.string().nullable(),
    payosTransactionId: z.string().nullable(),
    payosQrCode: z.string().nullable(),
    payosCheckoutUrl: z.string().nullable(),
    receivedAmount: z.number().nullable(),
    changeAmount: z.number().nullable(),
    gatewayResponse: z.any().nullable(),
    failureReason: z.string().nullable(),
    paidAt: z.date().nullable(),
    expiredAt: z.date().nullable(),
    processedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const CreatePayOSPaymentBodySchema = z
  .object({
    subscriptionId: z.number().int().positive(),
    amount: z.number().min(0),
    description: z.string().optional(),
  })
  .strict();

export const CreatePayOSPaymentResSchema = z.object({
  data: z.object({
    paymentId: z.number(),
    checkoutUrl: z.string(),
    qrCode: z.string().optional(),
    orderCode: z.string(),
  }),
  message: z.string(),
});

export const PayOSReturnParamsSchema = z.object({
  paymentId: z.string(),
  code: z.string(),
  id: z.string(),
  cancel: z.string().optional(),
  status: z.string(),
  orderCode: z.string(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
export type CreatePayOSPaymentBodyType = z.infer<typeof CreatePayOSPaymentBodySchema>;
export type CreatePayOSPaymentResType = z.infer<typeof CreatePayOSPaymentResSchema>;
export type PayOSReturnParamsType = z.infer<typeof PayOSReturnParamsSchema>;
