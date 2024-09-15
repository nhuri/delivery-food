const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

// Route to get statistics for a restaurant
router.get("/:id", statisticsController.getStatistics);

// Route to create or update statistics for a restaurant
router.patch("/:id", statisticsController.updateStatistics);

module.exports = router;
