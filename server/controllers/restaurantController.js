const Restaurant = require('../models/restaurantModel');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const axios = require('axios');
const geocoder = require('../utils/geocoder'); // Import the geocoder

const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

// Use environment variable for API key
const apiKey = process.env.GOOGLE_MAPS_API_KEY;



exports.createRestaurant = async (req, res) => {
  const { name, logo, address, menu, statistics } = req.body;

  try {
    // Geocode the address using Google API
    const geoData = await geocoder.geocode(address);

    if (!geoData.length) {
      return res.status(400).json({ msg: 'Unable to geocode address.' });
    }

    const { latitude, longitude } = geoData[0];

    // Create and save the new restaurant with geocoded location
    const newRestaurant = await Restaurant.create({
      name,
      logo,
      address,
      location: { latitude, longitude },
      menu,
      statistics
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ msg: 'Error creating restaurant', error: error.message });
  }
};



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
    const { name, logo, address, menu, statistics } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ msg: 'Restaurant not found' });
    }

    // Update address and use geocoding service if needed
    let location = restaurant.location;
    if (address && address !== restaurant.address) {
        try {
            const response = await client.geocode({
                params: {
                    address,
                    key: apiKey,
                },
            });

            if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry.location;
                location = { latitude: lat, longitude: lng };
            } else {
                return res.status(400).json({ msg: 'Address not found' });
            }
        } catch (error) {
            console.error('Error with Google Maps API:', error.message);
            return res.status(500).json({ msg: 'Error geocoding address' });
        }
    }

    // Update restaurant details
    restaurant.name = name || restaurant.name;
    restaurant.logo = logo || restaurant.logo;
    restaurant.address = address || restaurant.address;
    restaurant.location = location;
    restaurant.menu = menu || restaurant.menu;
    restaurant.statistics = statistics || restaurant.statistics;

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
