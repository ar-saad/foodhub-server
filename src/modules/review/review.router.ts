import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router: Router = Router();

// GET | "/api/v1/reviews" | Get all reviews
router.get("/", ReviewController.getReviews);

// GET | "/api/v1/reviews/:reviewId" | Get review by ID
router.get("/:reviewId", ReviewController.getReview);

// POST | "/api/v1/reviews" | Create review
router.post(
  "/",
  authenticate,
  authorize(UserRoles.CUSTOMER),
  ReviewController.createReview,
);

// PATCH | "/api/v1/reviews/:reviewId" | Update review
router.patch(
  "/:reviewId",
  authenticate,
  authorize(UserRoles.CUSTOMER),
  ReviewController.updateReview,
);

// DELETE | "/api/v1/reviews/:reviewId" | Delete review
router.delete(
  "/:reviewId",
  authenticate,
  authorize(UserRoles.CUSTOMER, UserRoles.ADMIN),
  ReviewController.deleteReview,
);

export const ReviewRouter = router;
