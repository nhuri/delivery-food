const Order = require("../models/orderModel");
const MenuItem = require("../models/menuItemModel");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel");
// const { processGooglePayPayment } = require("../utils/googlePay");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const mockProcessPayment = require("../utils/googlePay");
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

// 2. Add an item to the order
exports.addItemToOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { menuItemId, extrasIds = [], removedIngredientsIds = [] } = req.body;

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // Find the menu item
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) return res.status(404).json({ message: "MenuItem not found" });

  // Handle removed ingredients
  const remainingIngredients = menuItem.ingredients.filter(
    ingredient => !removedIngredientsIds.includes(ingredient._id.toString())
  );

  // Handle selected extras
  const selectedExtras = menuItem.extras.filter(extra =>
    extrasIds.includes(extra._id.toString())
  );

  // Calculate the total price for this menu item, including extras
  const extrasTotalPrice = selectedExtras.reduce((acc, extra) => acc + extra.price, 0);
  const itemTotalPrice = menuItem.price + extrasTotalPrice;

  // Add item to the order
  const orderItem = {
    menuItem: menuItem._id,
    quantity: 1, // Default quantity, can be changed dynamically
    price: itemTotalPrice,
    ingredients: remainingIngredients.map(ingredient => ({ name: ingredient.name })),
    extras: selectedExtras.map(extra => ({ name: extra.name, price: extra.price })),
  };

  order.items.push(orderItem);

  // Recalculate total order amount
  order.totalAmount = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  await order.save();

  res.status(200).json({
    menuItemId: menuItem._id,
    quantity: orderItem.quantity,
    price: orderItem.price,
    ingredients: orderItem.ingredients,
    extras: orderItem.extras,
    totalOrderAmount: order.totalAmount,
  });
});

// 3. Remove extras
exports.removeExtras = asyncHandler(async (req, res) => {
  const { orderId, menuItemId, extrasIds } = req.body;

  // Find the order and specific item
  const order = await Order.findById(orderId);
  const orderItem = order.items.find(item => item.menuItem.toString() === menuItemId);

  if (!orderItem) return res.status(404).json({ message: "Item not found in the order" });

  // Remove extras by filtering them out
  orderItem.extras = orderItem.extras.filter(extra => !extrasIds.includes(extra._id.toString()));

  // Recalculate the price
  orderItem.price = orderItem.extras.reduce(
    (acc, extra) => acc + extra.price, menuItem.price
  );

  await order.save();

  res.status(200).json({ status: "success", order });
});

// 4. Finalize Order
exports.finalizeOrder = asyncHandler(async (req, res, next) => {
  const { paymentData } = req.body;

  if (!paymentData || !paymentData.paymentToken || !paymentData.amount) {
    return next(new AppError(400, 'Invalid payment data.'));
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppError(404, 'Order not found.'));
  }

  try {
    const paymentResult = await mockProcessPayment(paymentData, order.totalAmount);
    // const paymentResult = await processGooglePayPayment(paymentData, order.totalAmount);
    if (!paymentResult.success) {
      return next(new AppError(500, 'Payment processing failed.'));
    }

    order.paymentStatus = 'Paid';
    order.transactionId = paymentResult.transactionId;
    order.status = 'Completed';
    await order.save();

    const customer = await User.findById(order.customer);
    if (customer) {
      customer.orders.push(order._id);
      await customer.save();
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant) {
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
