import * as z from "zod";

export const createMealSchema = z.object({
  providerId: z.uuid(),
  categoryId: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.url().optional(),
});

export const updateMealSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.url().optional(),
});
