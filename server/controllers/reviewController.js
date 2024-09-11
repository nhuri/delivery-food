const Review = require("../models/reviewModel");
const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuItemModel");
const asyncHandler = require("express-async-handler");

// Create a new review
exports.createReview = asyncHandler(async (req, res) => {
  const { reviewType, reviewTarget, author, rating, review, comment } =
    req.body;

  if (!["restaurant", "menuItem"].includes(reviewType)) {
    return res.status(400).json({ message: "Invalid review type" });
  }

  const targetModel = reviewType === "restaurant" ? Restaurant : MenuItem;
  const target = await targetModel.findById(reviewTarget);

  if (!target) {
    return res.status(404).json({ message: `${reviewType} not found` });
  }

  const newReview = new Review({
    reviewType,
    reviewTarget,
    author,
    rating,
    review,
    comment,
  });

  await newReview.save();

  res.status(201).json(newReview);
});

// Get all reviews for a specific restaurant or menu item
exports.getReviews = asyncHandler(async (req, res) => {
  const { reviewType, reviewTarget } = req.params;

  if (!["restaurant", "menuItem"].includes(reviewType)) {
    return res.status(400).json({ message: "Invalid review type" });
  }

  const reviews = await Review.find({ reviewType, reviewTarget })
    .populate("author", "name") // Populate the author field with user's name
    .exec();

  res.json(reviews);
});
