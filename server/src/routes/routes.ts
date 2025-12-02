import { Router } from 'express';

import dailyIntakeController from "../controllers/dailyIntake-controller";
import dietController from "../controllers/diet-controller";
import recipesController from "../controllers/recipes-controller";
import scannedItemsController from "../controllers/scannedItems-controller";
import userController from "../controllers/user-controller";
import healthCheck from "../controllers/healthCheck";
import stats from "../controllers/stats";
import metrics from "../controllers/metrics";
import {authMiddleware} from "../utils/AuthMiddleware";

// const router = express.Router();
const router = Router();

router.route("/users")
  .post(userController.createUser);

router.route("/users/login")
  .post(userController.logInUser);

// Apply authentication middleware to all routes below
if (process.env.NODE_ENV !== "test") {
  router.use(authMiddleware);
} 

// GET /health
router.get("/health/liveness", healthCheck.liveness);
router.get("/health/readiness", healthCheck.readiness);

// GET /metrics
router.use(metrics.metricsMiddleware);
router.get("/metrics", metrics.getMetrics);

// GET /stats
router.get("/stats", stats.getStats);
router.get("/stats/db", stats.getDbStats);

// DailyIntake Routes
router.route("/daily-intakes")
  .get(dailyIntakeController.getAllDailyIntakes)
  .post(dailyIntakeController.createDailyIntake);

router.route("/daily-intakes/history/user/:userId")
  .get(dailyIntakeController.getDailyIntakeHistoryByUserId);

router.route("/daily-intakes/:id")
  .get(dailyIntakeController.getDailyIntakeById)
  .put(dailyIntakeController.updateDailyIntake)

router.route("/daily-intakes/:id/user/:userId")
  .delete(dailyIntakeController.deleteDailyIntake);

router.route("/daily-intakes/:dailyIntakeId/food-items")
  .get(dailyIntakeController.getFoodItemsByDailyIntake)
  .post(dailyIntakeController.addFoodItemToDailyIntake);

// Diet Routes
router.route("/diets")
  .get(dietController.getAllDiets)
  .post(dietController.createDiet);

router.route("/diets/user/:userId")
  .get(dietController.getDietsByUserId);

router.route("/diets/:id")
  .get(dietController.getDietById)

router.route("/diets/:id/user/:userId")
  .put(dietController.updateDiet)
  .delete(dietController.deleteDiet);

// Recipes Routes
router.route("/recipes")
  .get(recipesController.getAllRecipes)
  .post(recipesController.createRecipe);

router.route("/recipes/user/:userId")
  .get(recipesController.getRecipesByUserId);

router.route("/recipes/search/ingredient/:ingredient")
  .get(recipesController.getRecipesByIngredient);

router.route("/recipes/:id")
  .get(recipesController.getRecipeById)

router.route("/recipes/:id/user/:userId")
  .put(recipesController.updateRecipe)
  .delete(recipesController.deleteRecipe);

// Scanned Items Routes
router.route("/scanned-items")
  .get(scannedItemsController.getAllScannedItems)
  .post(scannedItemsController.createScannedItem);
  
router.route("/scanned-items/:id")
  .get(scannedItemsController.getScannedItemById)
  .put(scannedItemsController.updateScannedItem)
  .delete(scannedItemsController.deleteScannedItem);

router.route("/users/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/users/:id/saved-recipes/:recipeId')
  .post(userController.addSavedRecipe)
  .delete(userController.removeSavedRecipe);

router.route('/users/:id/saved-scanned-items/:itemId')
  .post(userController.addSavedScannedItem)
  .delete(userController.removeSavedScannedItem);
export default router;
