const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Route to create a new restaurant
router.post('/', restaurantController.createRestaurant);

// Route to get all restaurants
router.get('/', restaurantController.getRestaurants);

// Route to get a single restaurant by ID
router.get('/:id', restaurantController.getRestaurantById);

// Route to update a restaurant by ID
router.patch('/:id', restaurantController.updateRestaurant);

// Route to delete a restaurant by ID
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;