const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const menuItemController = require("../controllers/menuItemController");
// Route to create a new restaurant

// Route to get all restaurants
router.get("/", restaurantController.getRestaurants);

// Route to get a single restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Route to update a restaurant by ID
router.patch("/:id", restaurantController.updateRestaurant);

// Route to delete a restaurant by ID
router.delete("/:id", restaurantController.deleteRestaurant);

router.post("/", restaurantController.createRestaurant);

// Route for applying a discount to a specific menu item
router.post("/:id/discount", menuItemController.applyDiscountToMenuItem);

// Route for creating a bundle for multiple menu items
router.post("/bundle", menuItemController.createBundle);

module.exports = router;
