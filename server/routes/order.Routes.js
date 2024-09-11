const express = require("express");
const router = express.Router();
const orderController = require('../controllers/orderController');
// Create a new order (with Google Pay integration)
router.post("/", orderController.createOrder);

// Get order status
router.get("/:id/status", orderController.getOrderStatus);

// Update order status
router.patch("/:id/status", orderController.updateOrderStatus);

// Communicate with delivery/restaurant
router.post("/:id/communicate", orderController.communicate);

module.exports = router;
