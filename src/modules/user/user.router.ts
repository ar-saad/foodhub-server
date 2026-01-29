import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { UserController } from "./user.controller";

const router: Router = Router();

// PATCH | "/api/v1/users/me" | Get currently logged in user data
router.get("/me", authenticate, UserController.getCurrentlyLoggedInUser);
// PATCH | "/api/v1/users/:userId" | Update user
router.patch("/:userId", authenticate, UserController.updateUser);

export const UserRouter = router;
