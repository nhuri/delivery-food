const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a review
router.post(
  "/reviewsForRestaurant",
  reviewController.createReviewForRestaurant
);
router.post("/reviewsForMenuItem", reviewController.createReviewForMenuItem);

// Get reviews by type and target
router.get("/:reviewTarget", reviewController.getReviewsForRestaurant);
router.get("/menuItem/:reviewTarget", reviewController.getReviewsForMenuItem);
router.get(
  "/menuItemRestaurant/:reviewTarget",
  reviewController.getTopThreeByRestaurantId
);

module.exports = router;
