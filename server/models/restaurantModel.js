const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String }, // URL or path to logo image
    address: { type: String, required: true },
    location: { type: String }, // Additional location details
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
    statistics: { type: mongoose.Schema.Types.ObjectId, ref: 'Statistics' }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);