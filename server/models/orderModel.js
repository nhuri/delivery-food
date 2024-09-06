const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        customization: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryTime: {
        type: Date, // Immediate or future time for delivery
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPerson'
    },
    communication: {
        type: String, // For communication between restaurant or delivery person
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;