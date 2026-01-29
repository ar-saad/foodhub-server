import { prisma } from "../../lib/prisma";

// GET | "/api/v1/categories" | Get all categories
const getCategories = async () => {
  return await prisma.category.findMany();
};

// POST | "/api/v1/categories" | Create new category
const createCategory = async (name: string) => {
  return await prisma.category.create({
    data: { name },
  });
};

export const CategoryService = {
  getCategories,
  createCategory,
};
