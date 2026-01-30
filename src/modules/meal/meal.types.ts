import * as z from "zod";
import { createMealSchema, updateMealSchema } from "./meal.schema";

export type CreateMealPayload = z.infer<typeof createMealSchema>;

export type UpdateMealPayload = z.infer<typeof updateMealSchema>;
