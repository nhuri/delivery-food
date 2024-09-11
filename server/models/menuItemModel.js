const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Italian",
      "Chinese",
      "Fast Food",
      "Mexican",
      "Indian",
      "French",
      "Japanese",
      "Vegetarian",
    ],
    required: true,
  },
  image: {
    type: String, // Store the file path for the uploaded image
  },
  extras: [
    {
      name: { type: String, required: true }, // e.g., "Extra Cheese", "Fries", "Ketchup"
      price: { type: Number }, // Price for the extra item
    },
  ],
  discount: {
    percentage: { type: Number, default: 0 }, // Discount percentage
    category: { type: String }, // Discount category
  },
  bundle: {
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }], // List of items in the bundle
    bundlePrice: { type: Number }, // Bundle price for all items
    category: { type: String }, // Bundle category
  },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
