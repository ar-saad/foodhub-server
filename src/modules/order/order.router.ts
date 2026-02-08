import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
import { OrderController } from "./order.controller";

const router: Router = Router();

// GET | "/api/v1/orders" | Get all orders
router.get("/", authenticate, OrderController.getOrders);

// GET | "/api/v1/orders/:orderId" | Get order by ID
router.get("/:orderId", authenticate, OrderController.getOrder);

// POST | "/api/v1/orders" | Create order
router.post(
  "/",
  authenticate,
  authorize(UserRoles.CUSTOMER),
  OrderController.createOrder,
);

// PATCH | "/api/v1/orders/:orderId" | Update order status
router.patch(
  "/:orderId",
  authenticate,
  authorize(UserRoles.CUSTOMER, UserRoles.PROVIDER),
  OrderController.updateOrder,
);

export const OrderRouter = router;
