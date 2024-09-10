const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderStatus,
  updateOrderStatus,
  communicate,
} = require("../controllers/orderController");

// Create a new order (with Google Pay integration)
router.post("/", createOrder);

// Get order status
router.get("/:id/status", getOrderStatus);

// Update order status
router.patch("/:id/status", updateOrderStatus);

// Communicate with delivery/restaurant
router.post("/:id/communicate", communicate);

module.exports = router;
