import { ReviewWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../utils/AppError";
import { omitUndefined } from "../../utils/object";
import { CreateReviewPayload, UpdateReviewPayload } from "./review.types";

// GET | "/api/v1/reviews" | Get all reviews
const getReviews = async (payload: {
  customerId: string | undefined;
  mealId: string | undefined;
  orderId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const { customerId, mealId, orderId, page, limit, skip, sortBy, sortOrder } =
    payload;

  const query: ReviewWhereInput[] = [];

  if (customerId) {
    query.push({ customerId });
  }

  if (mealId) {
    query.push({ mealId });
  }

  if (orderId) {
    query.push({ orderId });
  }

  const reviews = await prisma.review.findMany({
    take: limit,
    skip,
    where: {
      AND: query,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  const count = await prisma.review.count({
    where: {
      AND: query,
    },
  });

  return {
    metadata: {
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
    reviews,
  };
};

// GET | "/api/v1/reviews/:reviewId" | Get review by ID
const getReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  return review;
};

// POST | "/api/v1/reviews" | Create review
const createReview = async (payload: CreateReviewPayload) => {
  // Verify the order exists and belongs to the customer
  const order = await prisma.order.findUnique({
    where: { id: payload.orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.customerId !== payload.customerId) {
    throw new BadRequestError("You can only review your own orders");
  }

  if (order.status !== "DELIVERED") {
    throw new BadRequestError("You can only review delivered orders");
  }

  // Check if review already exists for this customer-meal-order combo
  const existingReview = await prisma.review.findUnique({
    where: {
      customerId_mealId_orderId: {
        customerId: payload.customerId,
        mealId: payload.mealId,
        orderId: payload.orderId,
      },
    },
  });

  if (existingReview) {
    throw new BadRequestError(
      "You have already reviewed this meal for this order",
    );
  }

  return await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        comment: payload.comment ?? null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        meal: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Recalculate and update meal rating stats
    const stats = await tx.review.aggregate({
      where: { mealId: payload.mealId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.meal.update({
      where: { id: payload.mealId },
      data: {
        averageRating: stats._avg.rating ?? 0,
        totalReviews: stats._count.rating,
      },
    });

    return review;
  });
};

// PATCH | "/api/v1/reviews/:reviewId" | Update review
const updateReview = async (
  reviewId: string,
  customerId: string,
  payload: UpdateReviewPayload,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.customerId !== customerId) {
    throw new BadRequestError("You can only update your own reviews");
  }

  const reqData = omitUndefined(payload);

  return await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: reqData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        meal: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Recalculate and update meal rating stats
    const stats = await tx.review.aggregate({
      where: { mealId: review.mealId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.meal.update({
      where: { id: review.mealId },
      data: {
        averageRating: stats._avg.rating ?? 0,
        totalReviews: stats._count.rating,
      },
    });

    return updatedReview;
  });
};

// DELETE | "/api/v1/reviews/:reviewId" | Delete review
const deleteReview = async (reviewId: string, customerId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.customerId !== customerId) {
    throw new BadRequestError("You can only delete your own reviews");
  }

  return await prisma.$transaction(async (tx) => {
    const deletedReview = await tx.review.delete({
      where: { id: reviewId },
    });

    // Recalculate and update meal rating stats
    const stats = await tx.review.aggregate({
      where: { mealId: review.mealId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.meal.update({
      where: { id: review.mealId },
      data: {
        averageRating: stats._avg.rating ?? 0,
        totalReviews: stats._count.rating,
      },
    });

    return deletedReview;
  });
};

export const ReviewService = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
