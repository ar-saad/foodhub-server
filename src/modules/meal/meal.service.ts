import { MealWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ForbiddenError, NotFoundError } from "../../utils/AppError";
import { omitUndefined } from "../../utils/object";
import { CreateMealPayload, UpdateMealPayload } from "./meal.types";

// GET | "/api/v1/meals" | Get all meals
const getMeals = async (payload: {
  search: string | undefined;
  categoryId: string | undefined;
  providerId: string | undefined;
  isFeatured: boolean | undefined;
  isAvailable: boolean | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const {
    search,
    categoryId,
    providerId,
    isFeatured,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;
  // Check if search value exists
  const query: MealWhereInput[] = [];

  if (search) {
    query.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Check if categoryId exists
  if (categoryId) {
    query.push({ categoryId });
  }

  // Check if providerId exists
  if (providerId) {
    query.push({ providerId });
  }

  // Check if isFeatured exists
  if (typeof isFeatured === "boolean") {
    query.push({ isFeatured });
  }

  // Check if isAvailable exists
  if (typeof isAvailable === "boolean") {
    query.push({ isAvailable });
  }

  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: query,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const count = await prisma.meal.count({
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
    meals,
  };
};

// GET | "/api/v1/meals/:mealId" | Get meal by ID
const getMeal = async (mealId: string) => {
  return await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
  });
};

// POST | "/api/v1/meals" | Create meal
const createMeal = async (payload: CreateMealPayload) => {
  return await prisma.meal.create({
    data: {
      ...payload,
      description: payload.description ?? null,
      image: payload.image ?? null,
    },
  });
};

// Verify the authenticated user owns the meal via providerProfile
const verifyMealOwnership = async (mealId: string, userId: string) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: { providerProfile: { select: { userId: true } } },
  });

  if (!meal) {
    throw new NotFoundError("Meal not found");
  }

  if (meal.providerProfile.userId !== userId) {
    throw new ForbiddenError("You are not authorized to modify this meal");
  }

  return meal;
};

// PATCH | "/api/v1/meals/mealId" | Update meal
const updateMeal = async (
  mealId: string,
  userId: string,
  payload: UpdateMealPayload,
) => {
  await verifyMealOwnership(mealId, userId);

  const data = omitUndefined(payload);

  return await prisma.meal.update({
    where: { id: mealId },
    data,
  });
};

// DELETE | "/api/v1/meals/:mealId" | Delete meal
const deleteMeal = async (mealId: string, userId: string) => {
  await verifyMealOwnership(mealId, userId);

  return await prisma.meal.delete({
    where: { id: mealId },
  });
};

export const MealService = {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
};
