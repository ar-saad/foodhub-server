import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
import { CategoryController } from "./category.controller";

const router: Router = Router();

// GET | "/api/v1/categories" | Get all categories
router.get("/", CategoryController.getCategories);

// GET | "/api/v1/categories/:categoryId" | Get category by ID
router.get(
  "/:categoryId",
  authenticate,
  authorize(UserRoles.ADMIN),
  CategoryController.getCategory,
);

// POST | "/api/v1/categories" | Create new category
router.post(
  "/",
  authenticate,
  authorize(UserRoles.ADMIN),
  CategoryController.createCategory,
);

// PATCH | "/api/v1/categories/:categoryId" | Update category
router.patch(
  "/:categoryId",
  authenticate,
  authorize(UserRoles.ADMIN),
  CategoryController.updateCategory,
);

// DELETE | "/api/v1/categories/:categoryId" | Delete category
router.delete(
  "/:categoryId",
  authenticate,
  authorize(UserRoles.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRouter = router;
