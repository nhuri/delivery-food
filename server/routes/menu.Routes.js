const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require('../controllers/menuController');

// Set up multer for image uploads
const storage = multer.memoryStorage(); // Temporarily store files in memory
const upload = multer({ storage });

// Create a new Menu
router.post("/", upload.single("image"), menuController.createMenu);

// Get all Menus
router.get("/", menuController.getMenus);

// Get a single Menu by ID
router.get("/:restaurantId", menuController.getMenuByRestaurantId);

// Update a Menu by ID
router.put("/:id", upload.single("image"), menuController.updateMenu);

// Add an Item to a Menu
router.post("/:menuId/items", upload.single("image"), menuController.addItemToMenu);

// Remove an Item from a Menu
router.delete("/:menuId/items/:itemId", menuController.removeItemFromMenu);

// Update a MenuItem in a Menu
router.put(
  "/:menuId/items/:itemId",
  upload.single("image"),
  menuController.updateMenuItemInMenu
);

// Delete a Menu by ID
router.delete("/delete/:id", menuController.deleteMenu);

module.exports = router;
