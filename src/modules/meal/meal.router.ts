import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
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
  authorize(UserRoles.PROVIDER),
  MealController.createMeal,
);

// PATCH | "/api/v1/meals/mealId" | Update meal
router.patch(
  "/:mealId",
  authenticate,
  authorize(UserRoles.PROVIDER),
  MealController.updateMeal,
);

// DELETE | "/api/v1/meals/:mealId" | Delete meal
router.get("/:mealId", MealController.deleteMeal);

export const MealRouter = router;
