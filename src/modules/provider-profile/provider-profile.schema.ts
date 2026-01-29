import * as z from "zod";

export const createProviderProfileSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  address: z.string(),
  description: z.string().optional(),
  logo: z.url().optional(),
});

export const updateProviderProfileSchema = z.object({
  userId: z.uuid(),
  name: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  logo: z.url().optional(),
});
