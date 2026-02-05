import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { MealService } from "./meal.service";
import { sendResponse } from "../../utils/sendResponse";
import { createMealSchema, updateMealSchema } from "./meal.schema";
import paginationSortingHelper from "../../utils/paginationSortingHelper";

// GET | "/api/v1/meals" | Get all meals
const getMeals = asyncHandler(async (req: Request, res: Response) => {
  const { search, categoryId, isFeatured, isAvailable } = req.query;

  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );

  const payload = {
    search: typeof search === "string" ? search : undefined,
    categoryId: typeof categoryId === "string" ? categoryId : undefined,
    ...(isFeatured === "true"
      ? { isFeatured: true }
      : isFeatured === "false"
        ? { isFeatured: false }
        : { isFeatured: undefined }),
    ...(isAvailable === "true"
      ? { isAvailable: true }
      : isAvailable === "false"
        ? { isAvailable: false }
        : { isAvailable: undefined }),
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };

  const result = await MealService.getMeals(payload);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Meals retrieved successfully",
      data: {
        meta: result.metadata,
        data: result.meals,
      },
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

  const payload = createMealSchema.parse(data);

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

// PATCH | "/api/v1/meals/mealId" | Update meal
const updateMeal = asyncHandler(async (req: Request, res: Response) => {
  const { mealId } = req.params;
  const data = req.body;

  const payload = updateMealSchema.parse(data);

  const result = await MealService.updateMeal(mealId as string, payload);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Meal updated successfully",
      data: result,
    },
    res,
  );
});

// DELETE | "/api/v1/meals/:mealId" | Delete meal
const deleteMeal = asyncHandler(async (req: Request, res: Response) => {
  const { mealId } = req.params;

  const result = await MealService.deleteMeal(mealId as string);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Meal deleted successfully",
      data: result,
    },
    res,
  );
});

export const MealController = {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
};
