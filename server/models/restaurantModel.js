const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String }, // URL or path to logo image
    address: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    statistics: { type: mongoose.Schema.Types.ObjectId, ref: 'Statistics' },
    foodCategory: {
        type: String,
        enum: ["Italian", "Chinese", "Fast Food", "Mexican", "Indian", "French", "Japanese", "Vegetarian"],
        default: "Italian"
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] // Added reviews field
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for reviews
restaurantSchema.virtual('reviewsList', {
    ref: 'Review', // The model to use
    localField: 'reviews', // Find reviews where `reviews` is equal to `_id`
    foreignField: '_id', // This is the field in the `Review` model
    justOne: false // Set to false because we want an array of reviews
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
