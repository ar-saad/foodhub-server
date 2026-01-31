import * as z from "zod";

export const createCategorySchema = z.object({
  name: z.string(),
  emoji: z.string(),
  image: z.url(),
});
