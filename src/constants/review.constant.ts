export const ReviewFor = {
  SERVICE: "SERVICE",
  PLATFORM: "PLATFORM",
} as const;

export const ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ReviewForType = (typeof ReviewFor)[keyof typeof ReviewFor];
export type ReviewStatusType = (typeof ReviewStatus)[keyof typeof ReviewStatus];
