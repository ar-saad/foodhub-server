import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "./order.types";

// POST | "/api/v1/orders" | Create order
const createOrder = async (payload: CreateOrderPayload) => {
  return await prisma.order.create({
    data: payload,
  });
};

export const OrderService = {
  createOrder,
};
