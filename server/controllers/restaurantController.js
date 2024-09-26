const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const axios = require("axios");
const geocoder = require("../utils/geocoder"); // Import the geocoder
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { Client } = require("@googlemaps/google-maps-services-js");
const Menu = require("../models/menuModel");
const MenuItem = require("../models/menuItemModel");
const client = new Client({});
const User = require("../models/userModel");

// Use environment variable for API key
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// Utility function for image upload and processing
const processImageUpload = async (file, type) => {
  const filename = `${type}-${Date.now()}.jpeg`;
  const imagePath = path.join(__dirname, `../uploads/${filename}`);

  await sharp(file.buffer)
    .resize(300, 300) // Resize as needed
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(imagePath);

  return `/uploads/${filename}`;
};

exports.createRestaurant = asyncHandler(async (req, res) => {
  const { name, address, menu, statistics, foodCategory } = req.body;

  try {
    // Geocode the address using Google API or another service
    const geoData = await geocoder.geocode(address);

    if (!geoData.length) {
      return res.status(400).json({ msg: "Unable to geocode address." });
    }

    const { latitude, longitude } = geoData[0];

    // Handle image upload if a logo file is provided
    let logoPath = null;
    if (req.file) {
      logoPath = await processImageUpload(req.file, "restaurant");
    }

    // Create and save the new restaurant with geocoded location and logo
    const newRestaurant = new Restaurant({
      name,
      logo: logoPath,
      address,
      location: { type: "Point", coordinates: [longitude, latitude] },
      menu,
      statistics,
      foodCategory,
    });

    const savedRestaurant = await newRestaurant.save();
    console.log(req.user) 
    // Update the user's restaurants array
    const user = await User.findById(req.user._id);
      console.log(req.user)  // Assuming req.user contains the logged-in user's info
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.restaurants.push(savedRestaurant._id);  // Add the new restaurant's ID to the user's restaurants field
    await user.save();  // Save the updated user document

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ msg: "Error creating restaurant", error: error.message });
  }
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
    return res.status(404).json({ msg: "Restaurant not found" });
  }
  res.json(restaurant);
});

// Update a restaurant by ID
exports.updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, logo, address, menu, statistics, foodCategory } = req.body;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return res.status(404).json({ msg: "Restaurant not found" });
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
        return res.status(400).json({ msg: "Address not found" });
      }
    } catch (error) {
      console.error("Error with Google Maps API:", error.message);
      return res.status(500).json({ msg: "Error geocoding address" });
    }
  }

  // Update restaurant details
  restaurant.name = name || restaurant.name;
  restaurant.logo = logo || restaurant.logo;
  restaurant.address = address || restaurant.address;
  restaurant.foodCategory = foodCategory || restaurant.foodCategory;
  restaurant.location = location;
  restaurant.menu = menu || restaurant.menu;
  restaurant.statistics = statistics || restaurant.statistics;

  const updatedRestaurant = await restaurant.save();
  res.json(updatedRestaurant);
});

// Delete a restaurant by ID
exports.getPhoneByResID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return res.status(404).json({ msg: "Restaurant not found" });
  }

  res.json(restaurant.phone);
});
// Delete a restaurant by ID
exports.deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findByIdAndDelete(id);
  if (!restaurant) {
    return res.status(404).json({ msg: "Restaurant not found" });
  }

  res.json({ msg: "Restaurant removed" });
});

exports.getTopThreeBySales = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return res.status(404).json({ msg: "Restaurant not found" });
  }
  const menu = await Menu.findById(restaurant.menu);
  const items = menu.items;
  const salesArr = await Promise.all(
    items.map(async (item) => {
      const menuItem = await MenuItem.findById(item);
      if (!menuItem || !menuItem.sold) return { sold: 0, menuItem };
      const sold = Number(menuItem.sold);
      return { sold, menuItem };
    })
  );
  const getTopThreeNumbers = (arr = []) => {
    return arr
      .filter((item) => item.sold >= 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3);
  };

  const topThree = getTopThreeNumbers(salesArr);

  res.json(topThree);
});
