import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ReviewService } from "./review.service";
import { createReviewSchema, updateReviewSchema } from "./review.schema";
import { sendResponse } from "../../utils/sendResponse";
import paginationSortingHelper from "../../utils/paginationSortingHelper";

// GET | "/api/v1/reviews" | Get all reviews
const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, mealId, orderId } = req.query;

  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );

  const payload = {
    customerId: typeof customerId === "string" ? customerId : undefined,
    mealId: typeof mealId === "string" ? mealId : undefined,
    orderId: typeof orderId === "string" ? orderId : undefined,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };

  const result = await ReviewService.getReviews(payload);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Reviews retrieved successfully",
      data: {
        meta: result.metadata,
        data: result.reviews,
      },
    },
    res,
  );
});

// GET | "/api/v1/reviews/:reviewId" | Get review by ID
const getReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  const result = await ReviewService.getReview(reviewId as string);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Review retrieved successfully",
      data: result,
    },
    res,
  );
});

// POST | "/api/v1/reviews" | Create review
const createReview = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user;

  data.customerId = user?.id;

  const payload = createReviewSchema.parse(data);

  const result = await ReviewService.createReview(payload);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
      data: result,
    },
    res,
  );
});

// PATCH | "/api/v1/reviews/:reviewId" | Update review
const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const user = req.user;

  const payload = updateReviewSchema.parse(req.body);

  const result = await ReviewService.updateReview(
    reviewId as string,
    user?.id as string,
    payload,
  );

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Review updated successfully",
      data: result,
    },
    res,
  );
});

// DELETE | "/api/v1/reviews/:reviewId" | Delete review
const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const user = req.user;

  await ReviewService.deleteReview(reviewId as string, user?.id as string);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Review deleted successfully",
      data: null,
    },
    res,
  );
});

export const ReviewController = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
