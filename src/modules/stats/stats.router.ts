import { Router } from "express";
import { StatsController } from "./stats.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";

const router: Router = Router();

// GET | "/api/v1/stats" | Public platform statistics (no auth required)
router.get("/", StatsController.getPlatformStats);

// GET | "/api/v1/stats/admin" | Admin dashboard statistics
router.get(
  "/admin",
  authenticate,
  authorize(UserRoles.ADMIN),
  StatsController.getAdminStats,
);

// GET | "/api/v1/stats/provider" | Provider dashboard statistics
router.get(
  "/provider",
  authenticate,
  authorize(UserRoles.PROVIDER),
  StatsController.getProviderStats,
);

export const StatsRouter = router;
