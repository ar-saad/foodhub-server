import * as z from "zod";
import { createOrderSchema } from "./order.schema";

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
