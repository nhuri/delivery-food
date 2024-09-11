const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String, // Field to store image path or URL
    },
    items: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MenuItem' 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
