const User = require("../models/userModel"); // Adjust the path as needed
const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/restaurantModel");
const geocoder = require("../utils/geocoder");

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
    res.status(404).json({ message: "User not found2" });
  }
});

// Update a user by ID
exports.updateUserById = asyncHandler(async (req, res) => {
  const address = req.body.address;
  // Geocode the address using Google Maps API
  const geoData = await geocoder.geocode(address);

  if (!geoData.length) {
    return res.status(400).json({ msg: "Unable to geocode address" });
  }

  const { latitude, longitude } = geoData[0];

  req.body.location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete a user by ID
exports.deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.getNearbyRestaurants = asyncHandler(async (req, res, next) => {
  const { userID } = req.params; // Fetch userID from URL params

  if (!userID) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  // Fetch the user by userID
  const user = await User.findById(userID);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const { location } = user; // Extract the location from the user document

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return res.status(400).json({ msg: "User location is not set properly" });
  }

  const [userLongitude, userLatitude] = location.coordinates;

  // Use geoNear aggregation to calculate the distance
  const restaurants = await Restaurant.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [userLongitude, userLatitude], // [longitude, latitude]
        },
        distanceField: "distance", // The calculated distance
        spherical: true, // Use spherical distance
        distanceMultiplier: 0.001, // Convert distance from meters to kilometers
        key: "location", // Specify the correct 2dsphere index field here
      },
    },
  ]);

  // Add "distanceInKM" field and remove "distance" field
  const restaurantsWithDistanceInKM = restaurants.map(
    ({ distance, ...restaurant }) => ({
      ...restaurant,
      distanceInKM: `${distance.toFixed(2)} km`, // Format distance with 2 decimal places
    })
  );

  res.status(200).json({
    status: "success",
    results: restaurantsWithDistanceInKM.length,
    data: restaurantsWithDistanceInKM,
  });
});
