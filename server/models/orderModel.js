const mongoose = require('mongoose');
const MenuItem = require('./menuItemModel'); // Import MenuItem model

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
            ref: 'MenuItem', // Ensure you use the correct reference here
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
        type: Date,
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
        type: String
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
