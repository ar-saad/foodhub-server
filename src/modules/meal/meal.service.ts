import { prisma } from "../../lib/prisma";
import { omitUndefined } from "../../utils/object";
import { CreateMealPayload, UpdateMealPayload } from "./meal.types";

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

// PATCH | "/api/v1/meals/mealId" | Update meal
const updateMeal = async (mealId: string, payload: UpdateMealPayload) => {
  const data = omitUndefined(payload);

  return await prisma.meal.update({
    where: {
      id: mealId,
    },
    data,
  });
};

// DELETE | "/api/v1/meals/:mealId" | Delete meal
const deleteMeal = async (mealId: string) => {
  return await prisma.meal.delete({
    where: {
      id: mealId,
    },
  });
};

export const MealService = {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
};
