import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../../../prisma/generated/prisma/enums";
import { CategoryController } from "./category.controller";

const router: Router = Router();

// GET | "/api/v1/categories" | Get all categories
router.get("/", CategoryController.getCategories);

// POST | "/api/v1/categories" | Create new category
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  CategoryController.createCategory,
);

export const CategoryRouter = router;
