import { CategoryWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CategoryCreatePayload } from "./category.types";

// GET | "/api/v1/categories" | Get all categories
const getCategories = async (payload: {
  search: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const { search, page, limit, skip, sortBy, sortOrder } = payload;

  const query: CategoryWhereInput[] = [];

  if (search) {
    query.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const categories = await prisma.category.findMany({
    take: limit,
    skip,
    where: {
      AND: query,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const count = await prisma.category.count();

  return {
    metadata: {
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
    categories,
  };
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
