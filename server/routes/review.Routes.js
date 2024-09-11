const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a review
router.post("/reviews", reviewController.createReview);

// Get reviews by type and target
router.get("/reviews/:reviewType/:reviewTarget", reviewController.getReviews);

module.exports = router;
