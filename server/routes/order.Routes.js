const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
// Create a new order (with Google Pay integration)
router.post("/createOrder", orderController.createOrder);

// Update order status
router.patch("/:id/status", orderController.updateOrderStatus);

// Communicate with delivery/restaurant
router.post("/:id/communicate", orderController.communicate);

router.get("/history", authController.protect, orderController.getOrderHistory);

module.exports = router;
