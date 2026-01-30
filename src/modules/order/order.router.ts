import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
import { OrderController } from "./order.controller";

const router: Router = Router();

// POST | "/api/v1/orders" | Create order
router.post(
  "/",
  authenticate,
  authorize(UserRoles.CUSTOMER),
  OrderController.createOrder,
);

export const OrderRouter = router;
