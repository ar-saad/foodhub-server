import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../../../prisma/generated/prisma/enums";
import { ProviderProfileController } from "./provider-profile.controller";

const router: Router = Router();

// POST | "/" | Create Provider Profile to become a provider
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  ProviderProfileController.createProviderProfile,
);
// PATCH | "/:providerId" | Update provider profile
router.patch(
  "/:providerId",
  authenticate,
  authorize(USER_ROLES.PROVIDER),
  ProviderProfileController.updateProviderProfile,
);

export const ProviderProfileRouter = router;
