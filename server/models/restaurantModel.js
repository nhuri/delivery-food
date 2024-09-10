const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String }, // URL or path to logo image
    address: { type: String, required: true },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    statistics: { type: mongoose.Schema.Types.ObjectId, ref: 'Statistics' },
    foodCategory: {
        type: String,
        enum: ["Italian", "Chinese", "Fast Food", "Mexican", "Indian", "French", "Japanese", "Vegetarian"],
        default: "Italian"
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
