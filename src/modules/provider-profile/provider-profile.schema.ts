import * as z from "zod";

export const createProviderProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string(),
  address: z.string(),
  description: z.string().optional(),
  logo: z.url().optional(),
});

export const updateProviderProfileSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  logo: z.url().optional(),
});
