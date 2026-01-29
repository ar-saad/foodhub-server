import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
import { ProviderProfileController } from "./provider-profile.controller";

const router: Router = Router();

// POST | "/" | Create Provider Profile to become a provider
router.post(
  "/",
  authenticate,
  authorize(UserRoles.CUSTOMER),
  ProviderProfileController.createProviderProfile,
);

// GET "/api/v1/provider-profiles" | Get all provider profiles
router.get("/", ProviderProfileController.getProviderProfiles);

// GET "/api/v1/provider-profiles/:providerId" | Get provider profile by ID
router.get("/:providerId", ProviderProfileController.getProviderProfile);

// PATCH | "/:providerId" | Update provider profile
router.patch(
  "/:providerId",
  authenticate,
  authorize(UserRoles.PROVIDER),
  ProviderProfileController.updateProviderProfile,
);

export const ProviderProfileRouter = router;
