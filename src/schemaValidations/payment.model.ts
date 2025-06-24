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
    buyerName: z.string().max(255).optional(),
    buyerEmail: z.string().email().optional(),
    buyerPhone: z.string().max(20).optional(),
    buyerAddress: z.string().max(500).optional(),
  })
  .strict();

export const CreatePayOSPaymentResSchema = z.object({
  data: z.object({
    payment: z.object({
      id: z.number(),
      subscriptionId: z.number(),
      amount: z.number(),
      status: z.string(),
      payosOrderId: z.string(),
      payosCheckoutUrl: z.string(),
    }),
    payosData: z.object({
      orderCode: z.number(),
      checkoutUrl: z.string(),
      qrCode: z.string().optional(),
      paymentLinkId: z.string(),
      expiredAt: z.number(),
      amount: z.number(),
    }),
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
