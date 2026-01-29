import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { OrderService } from "./order.service";
import { createOrderSchema } from "./order.schema";
import { sendResponse } from "../../utils/sendResponse";

// POST | "/api/v1/orders" | Create order
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

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

export const OrderController = {
  createOrder,
};
