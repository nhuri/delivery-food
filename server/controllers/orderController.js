const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
    const { customer, restaurant, items, totalAmount, deliveryTime, communication } = req.body;
    const newOrder = new Order({
        customer,
        restaurant,
        items,
        totalAmount,
        deliveryTime,
        communication
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
});

// Get real-time status of an order
const getOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('deliveryPerson restaurant items.menuItem');
    
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
});

// Update order status (e.g., Confirmed, Preparing, etc.)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
});

// Communicate with restaurant or delivery person
const communicate = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { message } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { communication: message }, { new: true });

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
});

module.exports = {
    createOrder,
    getOrderStatus,
    updateOrderStatus,
    communicate
};
