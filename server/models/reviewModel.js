const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    user: { type: String }, // Username or email
    rating: { type: Number, required: true },
    comment: { type: String }
});

module.exports = mongoose.model('Review', reviewSchema);
