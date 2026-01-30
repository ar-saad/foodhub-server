import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { OrderService } from "./order.service";
import { createOrderSchema } from "./order.schema";
import { sendResponse } from "../../utils/sendResponse";
import { OrderStatus } from "../../../prisma/generated/prisma/enums";

// GET | "/api/v1/orders" | Get all orders
const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await OrderService.getOrders();

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    },
    res,
  );
});

// POST | "/api/v1/orders" | Create order
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user;

  data.customerId = user?.id;

  const payload = createOrderSchema.parse(data);

  const result = await OrderService.createOrder(payload);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Order created successfully",
      data: result,
    },
    res,
  );
});

// PATCH | "/api/v1/orders/:orderId" | Update order status
const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const result = await OrderService.updateOrder(
    orderId as string,
    status as OrderStatus,
  );

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Order updated successfully",
      data: result,
    },
    res,
  );
});

export const OrderController = {
  getOrders,
  createOrder,
  updateOrder,
};
