const Menu = require('../models/menuModel');
const MenuItem = require('../models/menuItemModel');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Utility function for image upload and processing
const processImageUpload = async (file, type) => {
    const filename = `${type}-${Date.now()}.jpeg`;
    const imagePath = path.join(__dirname, `../uploads/${filename}`);

    await sharp(file.buffer)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(imagePath);

    return `/uploads/${filename}`;
};

// Create a new Menu with image upload
const createMenu = asyncHandler(async (req, res) => {
    const { name, description, restaurant } = req.body;

    if (!name || !restaurant) {
        return res.status(400).json({ message: 'Name and restaurant are required' });
    }

    let imagePath;
    if (req.file) {
        imagePath = await processImageUpload(req.file, 'menu');
    }

    const newMenu = new Menu({
        name,
        description,
        restaurant,
        image: imagePath || null
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
});

// Get all Menus
const getMenus = asyncHandler(async (req, res) => {
    const menus = await Menu.find().populate('items');
    res.json(menus);
});

// Get a single Menu by ID
const getMenuById = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id).populate('items');

    if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(menu);
});

// Update a Menu by ID with optional image upload
const updateMenu = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    let imagePath;
    if (req.file) {
        imagePath = await processImageUpload(req.file, 'menu');

        // Delete the old image if it exists
        if (menu.image && fs.existsSync(path.join(__dirname, `../uploads/${path.basename(menu.image)}`))) {
            fs.unlinkSync(path.join(__dirname, `../uploads/${path.basename(menu.image)}`));
        }

        menu.image = imagePath;
    }

    menu.name = name || menu.name;
    menu.description = description || menu.description;

    const updatedMenu = await menu.save();
    res.json(updatedMenu);
});

// Add an Item to a Menu with image upload
const addItemToMenu = asyncHandler(async (req, res) => {
    const { menuId } = req.params;
    const { name, description, price, category } = req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    let imagePath;
    if (req.file) {
        imagePath = await processImageUpload(req.file, 'menuItem');
    }

    // Create a new MenuItem
    const newMenuItem = new MenuItem({
        name,
        description,
        price,
        category,
        image: imagePath || null
    });

    const savedMenuItem = await newMenuItem.save();

    // Add the MenuItem to the Menu
    menu.items.push(savedMenuItem._id);
    await menu.save();

    res.status(201).json(savedMenuItem);
});

// Remove an Item from a Menu
const removeItemFromMenu = asyncHandler(async (req, res) => {
    const { menuId, itemId } = req.params;

    const menu = await Menu.findById(menuId);
    if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    menu.items = menu.items.filter(item => item.toString() !== itemId);
    await menu.save();

    const menuItem = await MenuItem.findById(itemId);
    if (menuItem) {
        // Delete the MenuItem and its image if it exists
        if (menuItem.image && fs.existsSync(path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`))) {
            fs.unlinkSync(path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`));
        }
        await menuItem.deleteOne();
    }

    res.json({ message: 'Item removed from menu' });
});

// Update a MenuItem in a Menu with image upload
const updateMenuItemInMenu = asyncHandler(async (req, res) => {
    const { menuId, itemId } = req.params;
    const { name, description, price, category } = req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
    }

    let imagePath;
    if (req.file) {
        imagePath = await processImageUpload(req.file, 'menuItem');

        // Delete the old image if it exists
        if (menuItem.image && fs.existsSync(path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`))) {
            fs.unlinkSync(path.join(__dirname, `../uploads/${path.basename(menuItem.image)}`));
        }

        menuItem.image = imagePath;
    }

    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
});

// Delete a Menu by ID with image removal
const deleteMenu = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
    }

    // Delete all menu items associated with this menu
    await MenuItem.deleteMany({ _id: { $in: menu.items } });

    // Delete the image if it exists
    if (menu.image && fs.existsSync(path.join(__dirname, `../uploads/${path.basename(menu.image)}`))) {
        fs.unlinkSync(path.join(__dirname, `../uploads/${path.basename(menu.image)}`));
    }

    await menu.deleteOne();

    res.json({ message: 'Menu removed' });
});

module.exports = {
    createMenu,
    getMenus,
    getMenuById,
    updateMenu,
    addItemToMenu,
    removeItemFromMenu,
    updateMenuItemInMenu,
    deleteMenu
};
