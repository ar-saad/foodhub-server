import { prisma } from "../../lib/prisma";
import { CreateMealPayload } from "./meal.types";

// GET | "/api/v1/meals" | Get all meals
const getMeals = async () => {
  return await prisma.meal.findMany();
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

export const MealService = {
  getMeals,
  getMeal,
  createMeal,
};
