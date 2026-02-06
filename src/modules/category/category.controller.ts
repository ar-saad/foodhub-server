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

// GET | "/api/v1/categories/:categoryId" | Get category by ID
const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const result = await CategoryService.getCategory(categoryId as string);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Category retrieved successfully",
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

// PATCH | "/api/v1/categories/:categoryId" | Update category
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name, emoji, image } = req.body;

  const payload = createCategorySchema.parse({ name, emoji, image });

  const result = await CategoryService.updateCategory(
    categoryId as string,
    payload,
  );

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Category updated successfully",
      data: result,
    },
    res,
  );
});

// DELETE | "/api/v1/categories/:categoryId" | Delete category
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const result = await CategoryService.deleteCategory(categoryId as string);

  sendResponse(
    {
      statusCode: 201,
      success: true,
      message: "Category deleted successfully",
      data: result,
    },
    res,
  );
});

export const CategoryController = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
