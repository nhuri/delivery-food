const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

// Create a new order
router.post("/createOrder", orderController.createOrder);

// update the current order
router.patch("/:orderId/updateItem",orderController.updateOrder);
// Add MenuItem(s) to an existing order
router.post("/:orderId/addItemToOrder",  orderController.addItemToOrder);

// Finalize an order
router.post("/:orderId/finalizeOrder",  orderController.finalizeOrder);

module.exports = router;
