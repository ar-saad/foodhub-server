import { prisma } from "../../lib/prisma";
import { CategoryCreatePayload } from "./category.types";

// GET | "/api/v1/categories" | Get all categories
const getCategories = async () => {
  return await prisma.category.findMany();
};

// GET | "/api/v1/categories/:categoryId" | Get category by ID
const getCategory = async (categoryId: string) => {
  return await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
};

// POST | "/api/v1/categories" | Create new category
const createCategory = async (payload: CategoryCreatePayload) => {
  return await prisma.category.create({
    data: payload,
  });
};

// PATCH | "/api/v1/categories/:categoryId" | Update category
const updateCategory = async (
  categoryId: string,
  payload: CategoryCreatePayload,
) => {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });
};

// DELETE | "/api/v1/categories/:categoryId" | Delete category
const deleteCategory = async (categoryId: string) => {
  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const CategoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
