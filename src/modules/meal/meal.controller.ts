import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { MealService } from "./meal.service";
import { omitUndefined } from "../../utils/object";
import { sendResponse } from "../../utils/sendResponse";

// GET | "/api/v1/meals" | Get all meals
const getMeals = asyncHandler(async (req: Request, res: Response) => {
  const result = await MealService.getMeals();

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Meals retrieved successfully",
      data: result,
    },
    res,
  );
});

// GET | "/api/v1/meals/:mealId" | Get meal by ID
const getMeal = asyncHandler(async (req: Request, res: Response) => {
  const { mealId } = req.params;

  const result = await MealService.getMeal(mealId as string);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Meal retrieved successfully",
      data: result,
    },
    res,
  );
});

// POST | "/api/v1/meals" | Create meal
const createMeal = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  const payload = omitUndefined({
    providerId: data.providerId,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
  });

  console.log(payload);

  const result = await MealService.createMeal(payload);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Meal created successfully",
      data: result,
    },
    res,
  );
});

export const MealController = {
  getMeals,
  getMeal,
  createMeal,
};
