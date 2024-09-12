const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { processGooglePayPayment } = require("../utils/googlePay");

// Controller for creating a new order and processing payment
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    customer,
    restaurant,
    items,
    totalAmount,
    deliveryTime,
    communication,
    paymentData,
  } = req.body;

  // Step 1: Process Google Pay payment
  try {
    const paymentResult = await processGooglePayPayment(
      paymentData,
      totalAmount
    );

    if (!paymentResult.success) {
      return res
        .status(400)
        .json({ message: "Payment failed", error: paymentResult.error });
    }

    // Step 2: If payment is successful, create the order
    const newOrder = new Order({
      customer,
      restaurant,
      items,
      totalAmount,
      deliveryTime,
      communication,
      paymentStatus: "Paid", // Update the order's payment status
      transactionId: paymentResult.transactionId, // Save transaction details for records
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Server error during payment processing",
      error: error.message,
    });
  }
});
// Get real-time status of an order
exports.getOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate(
    "deliveryPerson restaurant items.menuItem"
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// Update order status (e.g., Confirmed, Preparing, etc.)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!updatedOrder) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(updatedOrder);
});

exports.communicate = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { message } = req.body;

  // Check if message is provided
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { communication: message },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});
