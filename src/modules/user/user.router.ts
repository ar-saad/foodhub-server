import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { UserController } from "./user.controller";

const router: Router = Router();

router.get("/me", authenticate, UserController.getCurrentlyLoggedInUser);

export const UserRouter = router;
