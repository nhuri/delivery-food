const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
const paymentController = require("../controllers/PaymentController");
// Create a new order
router.post("/createOrder", orderController.createOrder);

// update the current order
router.patch("/:orderId/updateItem",orderController.updateOrder);
// Add MenuItem(s) to an existing order
router.post("/:orderId/addItemToOrder",  orderController.addItemToOrder);

// Finalize an order
router.post("/:orderId/finalizeOrder",  orderController.finalizeOrder);

router.post('/payment', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);

module.exports = router;
