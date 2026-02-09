import * as z from "zod";
import { createReviewSchema, updateReviewSchema } from "./review.schema";

export type CreateReviewPayload = z.infer<typeof createReviewSchema>;
export type UpdateReviewPayload = z.infer<typeof updateReviewSchema>;
