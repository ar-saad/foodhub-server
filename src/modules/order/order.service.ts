import { OrderStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "./order.types";

// GET | "/api/v1/orders" | Get all orders
const getOrders = async () => {
  return await prisma.order.findMany();
};

// POST | "/api/v1/orders" | Create order
const createOrder = async (payload: CreateOrderPayload) => {
  return await prisma.order.create({
    data: payload,
  });
};

// PATCH | "/api/v1/orders/:orderId" | Update order status
const updateOrder = async (orderId: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });
};

export const OrderService = {
  getOrders,
  createOrder,
  updateOrder,
};
