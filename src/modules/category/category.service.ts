import { prisma } from "../../lib/prisma";

type CategoryCreatePayload = {
  name: string;
};

// GET | "/api/v1/categories" | Get all categories
const getCategories = async () => {
  return await prisma.category.findMany();
};

// POST | "/api/v1/categories" | Create new category
const createCategory = async (payload: CategoryCreatePayload) => {
  return await prisma.category.create({
    data: payload,
  });
};

export const CategoryService = {
  getCategories,
  createCategory,
};
