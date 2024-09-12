const Review = require("../models/reviewModel");
const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuItemModel");
const asyncHandler = require("express-async-handler");

// Create Review for Restaurant
exports.createReviewForRestaurant = asyncHandler(async (req, res) => {
  const { restaurant, author, rating, review, comment } = req.body;

  try {
      // Validate required fields
      if (!restaurant || !author || !rating) {
          return res.status(400).json({ message: "Restaurant, author, and rating are required." });
      }

      // Check if the restaurant exists
      const existingRestaurant = await Restaurant.findById(restaurant);
      if (!existingRestaurant) {
          return res.status(404).json({ message: "Restaurant not found." });
      }

      // Create the review
      const newReview = await Review.create({
          restaurant,
          author,
          rating,
          review,
          comment
      });

      // Update the restaurant with the new review
      existingRestaurant.reviews.push(newReview._id);
      await existingRestaurant.save();

      res.status(201).json({
          status: 'success',
          data: {
              review: newReview
          }
      });
  } catch (error) {
      res.status(500).json({
          status: 'error',
          message: error.message
      });
  }
});
// Get all reviews for a specific restaurant or menu item
exports.getReviewsForRestaurant = asyncHandler(async (req, res) => {
  const { reviewTarget } = req.params;

  if (!reviewTarget) {
      return res.status(400).json({ message: "Review target is required" });
  }

  try {
      // Find the restaurant by reviewTarget
      const restaurant = await Restaurant.findById(reviewTarget)
          .populate({
              path: 'reviews',
              populate: {
                  path: 'author',
                  select: 'name'
              }
          });

      if (!restaurant) {
          return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json({
          status: 'success',
          data: {
              reviews: restaurant.reviews // Return the reviews from the restaurant
          }
      });
  } catch (error) {
      res.status(500).json({
          status: 'error',
          message: error.message
      });
  }
});
// Create Review for MenuItem
exports.createReviewForMenuItem = asyncHandler(async (req, res) => {
  const { menuItem, author, rating, review, comment } = req.body;

  try {
      // Validate required fields
      if (!menuItem || !author || !rating) {
          return res.status(400).json({ message: "Menu item, author, and rating are required." });
      }

      // Check if the menu item exists
      const existingMenuItem = await MenuItem.findById(menuItem);
      if (!existingMenuItem) {
          return res.status(404).json({ message: "Menu item not found." });
      }

      // Create the review
      const newReview = await Review.create({
          menuItem,
          author,
          rating,
          review,
          comment
      });

      // Update the menu item with the new review
      existingMenuItem.reviews.push(newReview._id);
      await existingMenuItem.save();

      res.status(201).json({
          status: 'success',
          data: {
              review: newReview
          }
      });
  } catch (error) {
      res.status(500).json({
          status: 'error',
          message: error.message
      });
  }
});
// Get all reviews for a specific menu item
exports.getReviewsForMenuItem = asyncHandler(async (req, res) => {
  const { reviewTarget } = req.params;

  if (!reviewTarget) {
      return res.status(400).json({ message: "Review target is required" });
  }

  try {
      // Find the menu item by reviewTarget
      const menuItem = await MenuItem.findById(reviewTarget)
          .populate({
              path: 'reviews',
              populate: {
                  path: 'author',
                  select: 'name'
              }
          });

      if (!menuItem) {
          return res.status(404).json({ message: "Menu item not found" });
      }

      res.status(200).json({
          status: 'success',
          data: {
              reviews: menuItem.reviews // Return the reviews from the menu item
          }
      });
  } catch (error) {
      res.status(500).json({
          status: 'error',
          message: error.message
      });
  }
});