const Order = require("../models/orderModel");
const MenuItem = require("../models/menuItemModel");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel");
const { processGooglePayPayment } = require("../utils/googlePay");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Statistics = require("../models/statisticsModel");
// 1. Create a new order
exports.createOrder = asyncHandler(async (req, res) => {
  const { customer, restaurant, deliveryTime, communication } = req.body;

  const newOrder = new Order({
    customer,
    restaurant,
    deliveryTime,
    communication,
    items: [],
    totalAmount: 0,
    paymentStatus: "Pending",
  });

  const savedOrder = await newOrder.save();
  res.status(201).json({ status: "success", order: savedOrder });
});

exports.addItemToOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { menuItemId } = req.body;

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Find the menu item
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return res.status(404).json({ message: "MenuItem not found" });
  }

  // Extract extras from menuItem
  const extras = menuItem.extras || [];

  // Add item to the order
  const orderItem = {
    menuItem: menuItem._id,
    quantity: 1, // Default quantity
    price: menuItem.price, // Price without extras
    extras: extras.map(extra => ({
      name: extra.name,
      price: extra.price,
    })),
  };

  order.items.push(orderItem);

  // Recalculate the total amount
  order.totalAmount += orderItem.price;

  await order.save();

  // Respond with only the desired details
  res.status(200).json({
    menuItemId: menuItem._id,
    quantity: orderItem.quantity,
    price: orderItem.price,
    extras: orderItem.extras,
  });
});
exports.finalizeOrder = asyncHandler(async (req, res, next) => {
  const { paymentData } = req.body;  // Assuming paymentData contains necessary info

  // Validate input
  if (!paymentData || !paymentData.paymentToken || !paymentData.amount) {
    return next(new AppError(400, 'Invalid payment data.'));
  }

  // Find the order
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppError(404, 'Order not found.'));
  }

  // Process payment
  try {
    const paymentResult = await processGooglePayPayment(paymentData, order.totalAmount);
    if (!paymentResult.success) {
      return next(new AppError(500, 'Payment processing failed.'));
    }

    // Update order status
    order.paymentStatus = 'Paid';
    order.transactionId = paymentResult.transactionId;
    order.status = 'Completed';  // Or update to your desired status
    await order.save();

    // // Optional: Update related entities ////// needs works
    // const customer = await User.findById(order.customer);
    // if (customer) {
    //   if (!customer.orders) {
    //     customer.orders = [];
    //   }
    //   customer.orders.push(order._id);
    //   await customer.save();
    // }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant) {
      if (!restaurant.orders) {
        restaurant.orders = [];
      }
      restaurant.orders.push(order._id);
      await restaurant.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Order finalized successfully.',
      order
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Payment processing error',
      error: error.message
    });
  }
});
