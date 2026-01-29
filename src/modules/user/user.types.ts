import * as z from "zod";
import { updateUserSchema } from "./user.schema";

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;
