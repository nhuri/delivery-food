const Menu = require("../models/menuModel");
const MenuItem = require("../models/menuItemModel");
const Restaurant = require("../models/restaurantModel");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
// Utility function for image upload and processing
const processImageUpload = async (file, type) => {
  const filename = `${type}-${Date.now()}.jpeg`;
  const imagePath = path.join(__dirname, `../uploads/${filename}`);

  await sharp(file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(imagePath);

  return `/uploads/${filename}`;
};

// Create a new menu
exports.createMenu = asyncHandler(async (req, res) => {
  const { name, description, restaurant } = req.body;

  if (!name || !restaurant) {
    return res
      .status(400)
      .json({ message: "Name and restaurant are required" });
  }

  let imagePath;
  if (req.file) {
    imagePath = await processImageUpload(req.file, "menu");
  }

  // Create and save the new menu
  const newMenu = new Menu({
    name,
    description,
    restaurant,
    image: imagePath || null,
  });

  const savedMenu = await newMenu.save();

  // Update the restaurant with the new menu ID
  await Restaurant.findByIdAndUpdate(
    restaurant,
    { $push: { menu: savedMenu._id } },
    { new: true }
  );

  // Respond with the saved menu
  res.status(201).json(savedMenu);
});

// Get all menus
exports.getMenus = asyncHandler(async (req, res) => {
  const menus = await Menu.find().populate("items");
  res.json(menus);
});

// Get menus by restaurantId
exports.getMenuByRestaurantId = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params; // Get restaurantId from URL params

  // Validate restaurantId format
  if (!mongoose.isValidObjectId(restaurantId)) {
    return res.status(400).json({ message: "Invalid restaurant ID format" });
  }

  // Find the restaurant to ensure it exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  // Find menus associated with the restaurant
  const menus = await Menu.find({ _id: { $in: restaurant.menu } }).populate(
    "items"
  );

  if (menus.length === 0) {
    return res
      .status(404)
      .json({ message: "No menus found for this restaurant" });
  }

  res.json(menus);
});

// Update a menu by ID with optional image upload
exports.updateMenu = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const menu = await Menu.findById(req.params.id);

  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  let imagePath;
  if (req.file) {
    imagePath = await processImageUpload(req.file, "menu");

    // Delete the old image if it exists
    if (menu.image) {
      const oldImagePath = path.join(
        __dirname,
        `../uploads/${path.basename(menu.image)}`
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    menu.image = imagePath;
  }

  menu.name = name || menu.name;
  menu.description = description || menu.description;

  const updatedMenu = await menu.save();
  res.json(updatedMenu);
});

// Add an item to a menu with optional image upload
exports.addItemToMenu = asyncHandler(async (req, res) => {
  const { menuId } = req.params;
  const { name, description, price, category, extras } = req.body;

  const menu = await Menu.findById(menuId);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  let imagePath;
  if (req.file) {
    imagePath = await processImageUpload(req.file, "menuItem");
  }

  // Create and save the new menu item
  const newMenuItem = new MenuItem({
    name,
    description,
    price,
    extras,
    category,
    image: imagePath || null,
  });

  const savedMenuItem = await newMenuItem.save();

  // Add the menu item to the menu
  menu.items.push(savedMenuItem._id);
  await menu.save();

  res.status(201).json(savedMenuItem);
});

// Remove an item from a menu
exports.removeItemFromMenu = asyncHandler(async (req, res) => {
  const { menuId, itemId } = req.params;

  const menu = await Menu.findById(menuId);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  const menuItem = await MenuItem.findById(itemId);
  if (menuItem) {
    // Delete the image of the menu item if it exists
    if (menuItem.image) {
      const imagePath = path.join(
        __dirname,
        `../uploads/${path.basename(menuItem.image)}`
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove the menu item from the menu
    menu.items = menu.items.filter((item) => item.toString() !== itemId);
    await menu.save();

    await menuItem.deleteOne();
  }

  res.json({ message: "Item removed from menu" });
});

// Update a menu item in a menu with optional image upload
exports.updateMenuItemInMenu = asyncHandler(async (req, res) => {
  const { menuId, itemId } = req.params;
  const { name, description, price, category, extras } = req.body;

  const menu = await Menu.findById(menuId);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  const menuItem = await MenuItem.findById(itemId);
  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  let imagePath;
  if (req.file) {
    imagePath = await processImageUpload(req.file, "menuItem");

    // Delete the old image if it exists
    if (menuItem.image) {
      const oldImagePath = path.join(
        __dirname,
        `../uploads/${path.basename(menuItem.image)}`
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    menuItem.image = imagePath;
  }

  menuItem.name = name || menuItem.name;
  menuItem.description = description || menuItem.description;
  menuItem.price = price || menuItem.price;
  menuItem.category = category || menuItem.category;
  menuItem.extras = extras || menuItem.extras;
  const updatedMenuItem = await menuItem.save();
  res.json(updatedMenuItem);
});

// Delete a menu by ID with image removal and update associated restaurants
exports.deleteMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the menu by ID
  const menu = await Menu.findById(id);

  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  // Delete all menu items associated with this menu
  if (menu.items.length > 0) {
    await MenuItem.deleteMany({ _id: { $in: menu.items } });
  }

  // Delete the menu's image if it exists
  if (menu.image) {
    const imagePath = path.join(
      __dirname,
      `../uploads/${path.basename(menu.image)}`
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Update all restaurants to remove the reference to the deleted menu
  await Restaurant.updateMany(
    { menu: id }, // Find restaurants where the menu is referenced
    { $pull: { menu: id } } // Remove the menu from the array
  );

  // Delete the menu
  await menu.deleteOne();

  res.json({ message: "Menu removed" });
});
