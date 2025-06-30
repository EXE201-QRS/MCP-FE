import { z } from "zod";

export const SubscriptionSchema = z
  .object({
    id: z.number(),
    userId: z.number(),
    restaurantName: z.string().trim().min(1).max(500),
    restaurantAddress: z.string().trim().min(1).max(1000),
    restaurantPhone: z.string().trim().min(1).max(15),
    restaurantType: z.string().trim().min(1).max(200),
    description: z.string().trim().max(1000).nullable(),
    servicePlanId: z.number(),
    durationDays: z.enum(["ONE_MONTH", "THREE_MONTHS", "SIX_MONTHS"]),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    status: z.enum(["PENDING", "PAID", "ACTIVE", "EXPIRED", "CANCELLED"]),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const UserRelationSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
  })
  .strict();

export const ServicePlanRelationSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
  })
  .strict();

export const SubscriptionWithRelationsSchema = SubscriptionSchema.extend({
  user: UserRelationSchema,
  servicePlan: ServicePlanRelationSchema,
});

// QOS Health Check Schema
export const QosHealthCheckSchema = z.object({
  amountUser: z.number().nullable(),
  amountTable: z.number().nullable(),
  amountOrder: z.number().nullable(),
  usedStorage: z.string().nullable(),
});

export const QosInstanceRelationSchema = z
  .object({
    id: z.number(),
    backEndUrl: z.string().url().nullable(),
    frontEndUrl: z.string().url().nullable(),
    statusBE: z.enum([
      "ACTIVE",
      "DEPLOYING",
      "ERROR",
      "INACTIVE",
      "MAINTENANCE",
    ]),
    statusFE: z.enum([
      "ACTIVE",
      "DEPLOYING",
      "ERROR",
      "INACTIVE",
      "MAINTENANCE",
    ]),
    statusDb: z.enum([
      "ACTIVE",
      "DEPLOYING",
      "ERROR",
      "INACTIVE",
      "MAINTENANCE",
    ]),
  })
  .nullable();

export const SubscriptionWithQosHealthSchema = SubscriptionSchema.extend({
  qosInstance: QosInstanceRelationSchema,
  servicePlan: ServicePlanRelationSchema,
  healthCheck: QosHealthCheckSchema.nullable(),
});

export const GetSubscriptionQosHealthResSchema = z.object({
  data: SubscriptionWithQosHealthSchema,
  message: z.string(),
});

// List subscriptions - includes user and servicePlan
export const GetSubscriptionsResSchema = z.object({
  data: z.array(SubscriptionWithRelationsSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetSubscriptionParamsSchema = z
  .object({
    subscriptionId: z.coerce.number().int().positive(),
  })
  .strict();

// Single subscription detail - also includes user and servicePlan
export const GetSubscriptionDetailResSchema = z.object({
  data: SubscriptionWithRelationsSchema,
  message: z.string(),
});

export const CreateSubscriptionBodySchema = SubscriptionSchema.pick({
  userId: true,
  restaurantName: true,
  restaurantAddress: true,
  restaurantPhone: true,
  restaurantType: true,
  description: true,
  servicePlanId: true,
  durationDays: true,
}).strict();

export const UpdateSubscriptionBodySchema = CreateSubscriptionBodySchema.extend(
  {
    startDate: SubscriptionSchema.shape.startDate.optional(),
    endDate: SubscriptionSchema.shape.endDate.optional(),
    status: SubscriptionSchema.shape.status.optional(),
  }
);

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
export type SubscriptionWithRelationsType = z.infer<
  typeof SubscriptionWithRelationsSchema
>;
export type QosHealthCheckType = z.infer<typeof QosHealthCheckSchema>;
export type SubscriptionWithQosHealthType = z.infer<
  typeof SubscriptionWithQosHealthSchema
>;
export type GetSubscriptionsResType = z.infer<typeof GetSubscriptionsResSchema>;
export type GetSubscriptionParamsType = z.infer<
  typeof GetSubscriptionParamsSchema
>;
export type GetSubscriptionDetailResType = z.infer<
  typeof GetSubscriptionDetailResSchema
>;
export type GetSubscriptionQosHealthResType = z.infer<
  typeof GetSubscriptionQosHealthResSchema
>;
export type CreateSubscriptionBodyType = z.infer<
  typeof CreateSubscriptionBodySchema
>;
export type UpdateSubscriptionBodyType = z.infer<
  typeof UpdateSubscriptionBodySchema
>;

// Duration options for UI
export const DurationOptions = [
  { value: "ONE_MONTH", label: "1 tháng", months: 1 },
  { value: "THREE_MONTHS", label: "3 tháng", months: 3 },
  { value: "SIX_MONTHS", label: "6 tháng", months: 6 },
] as const;

// Restaurant type options
export const RestaurantTypeOptions = [
  { value: "fast_food", label: "Thức ăn nhanh" },
  { value: "cafe", label: "Quán café" },
  { value: "fine_dining", label: "Nhà hàng cao cấp" },
  { value: "casual_dining", label: "Nhà hàng bình dân" },
  { value: "buffet", label: "Buffet" },
  { value: "bar_pub", label: "Bar/Pub" },
  { value: "street_food", label: "Đồ ăn đường phố" },
  { value: "bakery", label: "Tiệm bánh" },
  { value: "ice_cream", label: "Kem/Chè" },
  { value: "other", label: "Khác" },
] as const;
