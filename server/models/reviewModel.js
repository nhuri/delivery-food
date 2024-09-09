const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "The feedback must belongto a user"],
    },
    rating:{
        type: Number,
        min: [1, "The minimum rating cannot be below 1"],
        max: [5, "The maximum rating cannot be above 5"],
        required: [true, "The feedback must have a rating"]
    },
    review:{
        type:String,
        maxLength: 300
    },
    comment: { type: String }
});

module.exports = mongoose.model('Review', reviewSchema);
