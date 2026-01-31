import * as z from "zod";
import { createCategorySchema } from "./category.schema";

export type CategoryCreatePayload = z.infer<typeof createCategorySchema>;
