const express = require('express');
const router = express.Router();
const { createMenuItem, getMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem } = require('../controllers/menuItemController');
const upload = require('../utils/multerConfig');

// Route to add a new menu item with image upload (Create)
router.post('/', upload.single('image'), createMenuItem);

// Route to get all menu items (Read)
router.get('/', getMenuItems);

// Route to get a single menu item by ID (Read)
router.get('/:id', getMenuItemById);

// Route to update a menu item by ID with optional image upload (Update)
router.patch('/:id', upload.single('image'), updateMenuItem);

// Route to delete a menu item by ID (Delete)
router.delete('/:id', deleteMenuItem);

module.exports = router;
