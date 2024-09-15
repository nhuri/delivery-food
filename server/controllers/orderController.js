const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { processGooglePayPayment } = require("../utils/googlePay");
const  Statistics  = require("../models/statisticsModel");
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

    // Step 3: Update statistics
    const stats = await Statistics.findOne({
      restaurant: savedOrder.restaurant,
    });
    if (stats) {
      stats.orders += 1;
      await stats.save();
    } else {
      await Statistics.create({
        restaurant: savedOrder.restaurant,
        orders: 1,
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Server error during payment processing",
      error: error.message,
    });
  }
});

// Get order history for a user
exports.getOrderHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available in req.user
  const orders = await Order.find({ customer: userId }).populate(
    "items.menuItem"
  );

  if (orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this user" });
  }

  res.status(200).json(orders);
});

// Update order status
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

  // If the order status is updated to "Paid", update statistics
  if (status === "Paid") {
    const stats = await Statistics.findOne({
      restaurant: updatedOrder.restaurant,
    });
    if (stats) {
      stats.orders += 1;
      await stats.save();
    } else {
      await Statistics.create({
        restaurant: updatedOrder.restaurant,
        orders: 1,
      });
    }
  }

  res.status(200).json(updatedOrder);
});

// Update order communication
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
