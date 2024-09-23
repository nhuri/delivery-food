const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage(); // Temporarily store files in memory
const upload = multer({ storage });
const restaurantController = require("../controllers/restaurantController");
const menuItemController = require("../controllers/menuItemController");
// Route to create a new restaurant

// Route to get all restaurants
router.get("/", restaurantController.getRestaurants);

// Route to get a single restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

//Route to get the top three menu item by sales by restaurant ID
router.get("/topThreeBySales/:id", restaurantController.getTopThreeBySales);

// Route to update a restaurant by ID
router.patch("/:id", restaurantController.updateRestaurant);

// Route to delete a restaurant by ID
router.delete("/:id", restaurantController.deleteRestaurant);

router.post("/", upload.single("logo"), restaurantController.createRestaurant);

// Route for applying a discount to a specific menu item
router.post("/:id/discount", menuItemController.applyDiscountToMenuItem);

// Route for creating a bundle for multiple menu items
router.post("/bundle", menuItemController.createBundle);

module.exports = router;
