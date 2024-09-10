const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createMenu, getMenus, getMenuById, updateMenu, addItemToMenu, removeItemFromMenu, updateMenuItemInMenu, deleteMenu } = require('../controllers/menuController');

// Set up multer for image uploads
const storage = multer.memoryStorage(); // Temporarily store files in memory
const upload = multer({ storage });

// Create a new Menu
router.post('/', upload.single('image'), createMenu);

// Get all Menus
router.get('/', getMenus);

// Get a single Menu by ID
router.get('/:id', getMenuById);

// Update a Menu by ID
router.put('/:id', upload.single('image'), updateMenu);

// Add an Item to a Menu
router.post('/:menuId/items', upload.single('image'), addItemToMenu);

// Remove an Item from a Menu
router.delete('/:menuId/items/:itemId', removeItemFromMenu);

// Update a MenuItem in a Menu
router.put('/:menuId/items/:itemId', upload.single('image'), updateMenuItemInMenu);

// Delete a Menu by ID
router.delete('/:id', deleteMenu);

module.exports = router;
