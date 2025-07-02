import { ReviewFor, ReviewStatus } from "@/constants/review.constant";
import { SubscriptionSchema } from "@/schemaValidations/subscription.model";
import { UserSchema } from "@/schemaValidations/user.model";
import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.number(),
  userId: z.coerce.number().int().positive(),
  subscriptionId: z.coerce.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  status: z
    .enum([ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED])
    .default(ReviewStatus.PENDING),
  isPublic: z.boolean().default(false),
  reviewFor: z
    .enum([ReviewFor.PLATFORM, ReviewFor.SERVICE])
    .default(ReviewFor.SERVICE),

  adminResponse: z.string().nullable(),
  responsedAt: z.date().nullable(),
  responsedById: z.number().nullable(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ReviewWithFullSchema = ReviewSchema.extend({
  user: UserSchema.pick({
    id: true,
    name: true,
    email: true,
    avatar: true,
  }),
  subscription: SubscriptionSchema.pick({
    id: true,
    restaurantName: true,
    restaurantAddress: true,
    restaurantPhone: true,
    restaurantType: true,
    servicePlanId: true,
  }),
  responsedBy: UserSchema.pick({
    id: true,
    name: true,
    email: true,
    avatar: true,
  }).nullable(),
});

//GET
export const GetReviewesResSchema = z.object({
  data: z.array(ReviewWithFullSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetReviewParamsSchema = z
  .object({
    reviewId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetReviewDetailResSchema = z.object({
  data: ReviewSchema,
  message: z.string(),
});

export const GetReviewDetailResWithFullSchema = z.object({
  data: ReviewWithFullSchema,
  message: z.string(),
});

export const CreateReviewBodySchema = ReviewSchema.pick({
  userId: true,
  subscriptionId: true,
  rating: true,
  content: true,
  reviewFor: true,
}).strict();

export const UpdateReviewBodySchema = CreateReviewBodySchema.extend({
  status: ReviewSchema.shape.status.optional(),
  isPublic: ReviewSchema.shape.isPublic.optional(),
  adminResponse: ReviewSchema.shape.adminResponse.optional(),
  responsedById: ReviewSchema.shape.responsedById.optional(),
});

// Admin response schema
export const AdminResponseReviewBodySchema = z
  .object({
    adminResponse: z.string().min(1, "Phản hồi của admin là bắt buộc"),
    status: z.enum([ReviewStatus.APPROVED, ReviewStatus.REJECTED]),
    isPublic: z.boolean().optional(),
  })
  .strict();

// Query schema for filtering
export const GetReviewQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z
      .enum([ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED])
      .optional(),
    reviewFor: z.enum([ReviewFor.PLATFORM, ReviewFor.SERVICE]).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    userId: z.coerce.number().int().positive().optional(),
    subscriptionId: z.coerce.number().int().positive().optional(),
    isPublic: z.coerce.boolean().optional(),
    search: z.string().optional(), // Search in content
  })
  .strict();

//types
export type ReviewType = z.infer<typeof ReviewSchema>;
export type CreateReviewBodyType = z.infer<typeof CreateReviewBodySchema>;
export type UpdateReviewBodyType = z.infer<typeof UpdateReviewBodySchema>;
export type AdminResponseReviewBodyType = z.infer<
  typeof AdminResponseReviewBodySchema
>;
export type GetReviewParamsType = z.infer<typeof GetReviewParamsSchema>;
export type GetReviewQueryType = z.infer<typeof GetReviewQuerySchema>;
export type GetReviewDetailResType = z.infer<typeof GetReviewDetailResSchema>;
export type GetReviewDetailResWithFullType = z.infer<
  typeof GetReviewDetailResWithFullSchema
>;
export type GetReviewesResType = z.infer<typeof GetReviewesResSchema>;
