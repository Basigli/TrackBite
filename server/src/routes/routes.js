const express = require("express");

const dailyIntakeController = require("../controllers/dailyIntake-controller");
const dietController = require("../controllers/diet-controller");
const recipesController = require("../controllers/recipes-controller");
const scannedItemsController = require("../controllers/scannedItems-controller");
const userController = require("../controllers/user-controller");
const healthCheck = require("../controllers/healthCheck");
const stats = require("../controllers/stats");

const router = express.Router();

// GET /health
router.get("/", healthCheck);

// GET /stats
router.get("/stats", stats);

// DailyIntake Routes
router.route("/daily-intakes")
  .get(dailyIntakeController.getAllDailyIntakes)
  .post(dailyIntakeController.createDailyIntake);

router.route("/daily-intakes/:id")
  .get(dailyIntakeController.getDailyIntakeById)
  .put(dailyIntakeController.updateDailyIntake)
  .delete(dailyIntakeController.deleteDailyIntake);

router.route("/daily-intakes/:dailyIntakeId/food-items")
  .get(dailyIntakeController.getFoodItemsByDailyIntake)
  .post(dailyIntakeController.addFoodItemToDailyIntake);

// Diet Routes
router.route("/diets")
  .get(dietController.getAllDiets)
  .post(dietController.createDiet);

router.route("/diets/:id")
  .get(dietController.getDietById)
  .put(dietController.updateDiet)
  .delete(dietController.deleteDiet);

// Recipes Routes
router.route("/recipes")
  .get(recipesController.getAllRecipes)
  .post(recipesController.createRecipe);

router.route("/recipes/:id")
  .get(recipesController.getRecipeById)
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
