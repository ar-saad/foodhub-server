import { Router } from "express";
import { StatsController } from "./stats.controller";

const router: Router = Router();

// GET | "/api/v1/stats" | Public platform statistics (no auth required)
router.get("/", StatsController.getPlatformStats);

export const StatsRouter = router;
