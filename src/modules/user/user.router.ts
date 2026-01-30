import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserController } from "./user.controller";
import { UserRoles } from "../../../prisma/generated/prisma/enums";

const router: Router = Router();

// GET | "/api/v1/users" | Get all users
router.get(
  "/",
  authenticate,
  authorize(UserRoles.ADMIN),
  UserController.getUsers,
);

// GET | "/api/v1/users/me" | Get currently logged in user data
router.get("/me", authenticate, UserController.getCurrentlyLoggedInUser);

// PATCH | "/api/v1/users/:userId" | Update user
router.patch("/:userId", authenticate, UserController.updateUser);

// PATCH | "/api/v1/users/status/:userId" | Update user status
router.patch(
  "/status/:userId",
  authenticate,
  authorize(UserRoles.ADMIN),
  UserController.updateUserStatus,
);

export const UserRouter = router;
