import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CategoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import { createCategorySchema } from "./category.schema";

// GET | "/api/v1/categories" | Get all categories
const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategories();

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Categories retrieved created",
      data: result,
    },
    res,
  );
});

// POST | "/api/v1/categories" | Create new category
const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, emoji, image } = req.body;

  const payload = createCategorySchema.parse({ name, emoji, image });

  const result = await CategoryService.createCategory(payload);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Category successfully created",
      data: result,
    },
    res,
  );
});

export const CategoryController = {
  getCategories,
  createCategory,
};
