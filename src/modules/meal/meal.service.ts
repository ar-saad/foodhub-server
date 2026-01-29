import { prisma } from "../../lib/prisma";

type MealCreatePayload = {
  providerId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image: string;
};

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
const createMeal = async (payload: MealCreatePayload) => {
  return await prisma.meal.create({
    data: payload,
  });
};

export const MealService = {
  getMeals,
  getMeal,
  createMeal,
};
