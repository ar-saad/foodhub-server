import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../../../prisma/generated/prisma/enums";
import { MealController } from "./meal.controller";

const router: Router = Router();

// GET | "/api/v1/meals" | Get all meals
router.get("/", MealController.getMeals);

// GET | "/api/v1/meals/:mealId" | Get meal by ID
router.get("/:mealId", MealController.getMeal);

// POST | "/api/v1/meals" | Create meal
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.PROVIDER),
  MealController.createMeal,
);

export const MealRouter = router;
