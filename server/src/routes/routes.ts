import { get } from "http";
import { getMetrics } from "../controllers/metrics";

const express = require("express");

const dailyIntakeController = require("../controllers/dailyIntake-controller");
const dietController = require("../controllers/diet-controller");
const recipesController = require("../controllers/recipes-controller");
const scannedItemsController = require("../controllers/scannedItems-controller");
const userController = require("../controllers/user-controller");
const healthCheck = require("../controllers/healthCheck");
const stats = require("../controllers/stats");
const metrics = require("../controllers/metrics");

const router = express.Router();

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
  .put(dietController.updateDiet)

router.route("/diets/:id/user/:userId")
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

// User Routes
router.route("/users")
  .post(userController.createUser);

router.route("/users/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
