import * as z from "zod";
import { PaymentType } from "../../../prisma/generated/prisma/enums";

export const createOrderItemSchema = z.object({
  mealId: z.uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  image: z.url().optional(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1),
  providerId: z.uuid(),
  items: z.array(createOrderItemSchema).min(1),
  totalAmount: z.number().positive(),
  address: z.string().min(5),
  paymentType: z.enum(PaymentType),
});
