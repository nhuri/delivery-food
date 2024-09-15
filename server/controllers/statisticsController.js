const Statistics = require("../models/statisticsModel");
const asyncHandler = require("express-async-handler");

// Get statistics for a restaurant
exports.getStatistics = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  const stats = await Statistics.findOne({ restaurant: restaurantId });

  if (!stats) {
    return res
      .status(404)
      .json({ message: "Statistics not found for this restaurant" });
  }

  res.status(200).json(stats);
});

// Create or update statistics for a restaurant
exports.updateStatistics = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const { orders } = req.body;

  let stats = await Statistics.findOne({ restaurant: restaurantId });

  if (stats) {
    // Update existing statistics
    stats.orders = orders || stats.orders;
    await stats.save();
  } else {
    // Create new statistics
    stats = await Statistics.create({
      restaurant: restaurantId,
      orders: orders || 0,
    });
  }

  res.status(200).json(stats);
});
