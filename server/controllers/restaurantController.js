const Restaurant = require('../models/restaurantModel');
const asyncHandler = require('express-async-handler');

// Create a new restaurant
exports.createRestaurant = asyncHandler(async (req, res) => {
    const { name, logo, address, location, menu, statistics } = req.body;

    const newRestaurant = new Restaurant({
        name,
        logo,
        address,
        location,
        menu,
        statistics
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
});

// Get all restaurants
exports.getRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
});

// Get a single restaurant by ID
exports.getRestaurantById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.json(restaurant);
});

// Update a restaurant by ID
exports.updateRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, logo, address, location, menu, statistics } = req.body;

    console.log('Request body:', req.body);

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.logo = logo || restaurant.logo;
    restaurant.address = address || restaurant.address;
    restaurant.location = location || restaurant.location;
    restaurant.menu = menu || restaurant.menu;
    restaurant.statistics = statistics || restaurant.statistics;

    console.log('Updated restaurant object:', restaurant);

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
});


// Delete a restaurant by ID
exports.deleteRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json({ msg: 'Restaurant removed' });
});
