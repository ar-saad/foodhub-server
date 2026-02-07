import * as z from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.url().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
