const User = require('../models/userModel'); // Adjust the path as needed
const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/restaurantModel')

// Create a new user
exports.createUser = asyncHandler(async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
});

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// Get a user by ID
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Update a user by ID
exports.updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete a user by ID
exports.deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        res.status(200).json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


exports.getNearbyRestaurants = async (req, res, next) => {
    const { userLatitude, userLongitude } = req.body;
  
    if (!userLatitude || !userLongitude) {
      return res.status(400).json({ msg: 'User location (latitude and longitude) is required' });
    }
  
    try {
      // Find restaurants sorted by distance from user
      const restaurants = await Restaurant.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [userLongitude, userLatitude] // [longitude, latitude]
            },
            // $maxDistance: 50000 // Optional: limit results to 50km radius
          }
        }
      });
  
      res.status(200).json({
        status: 'success',
        results: restaurants.length,
        data: restaurants
      });
    } catch (error) {
      console.error(error);
      return next(new AppError(500, 'Error fetching restaurants'));
    }
  };