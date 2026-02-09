import * as z from "zod";

export const createReviewSchema = z.object({
  customerId: z.string().min(1),
  mealId: z.uuid(),
  orderId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});
