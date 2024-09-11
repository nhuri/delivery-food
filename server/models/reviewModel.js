const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  // Specify the type of the review (restaurant or menu item)
  reviewType: {
    type: String,
    enum: ["restaurant", "menuItem"],
    required: [true, "Review type is required"],
  },
  // Reference to either restaurant or menu item based on reviewType
  reviewTarget: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Review target is required"],
    refPath: "reviewType",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
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
