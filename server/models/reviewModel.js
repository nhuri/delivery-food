const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  restaurant: {
    type: Schema.ObjectId,
    ref: "Restaurant",
    required: function() { return !this.menuItem; }, // Required if menuItem is not provided
    message: "The feedback must belong to a Restaurant"
  },
  menuItem: {
    type: Schema.ObjectId,
    ref: "MenuItem",
    required: function() { return !this.restaurant; }, // Required if restaurant is not provided
    message: "The feedback must belong to a menuItem"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The feedback must belong to a user"],
  },
  rating: {
    type: Number,
    min: [1, "The minimum rating cannot be below 1"],
    max: [5, "The maximum rating cannot be above 5"],
    required: [true, "The feedback must have a rating"],
  },
  review: {
    type: String,
    maxLength: 300,
  },
  comment: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
