import * as z from "zod";
import { createMealSchema } from "./meal.schema";

export type CreateMealPayload = z.infer<typeof createMealSchema>;
