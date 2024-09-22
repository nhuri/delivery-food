const Review = require("../models/reviewModel");
const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuItemModel");
const Menu = require("../models/menuModel");
const asyncHandler = require("express-async-handler");
const Statistics = require("../models/statisticsModel");

// Create Review for Restaurant
exports.createReviewForRestaurant = asyncHandler(async (req, res) => {
  const { restaurant, author, rating, review, comment } = req.body;

  try {
    // Validate required fields
    if (!restaurant || !author || !rating) {
      return res
        .status(400)
        .json({ message: "Restaurant, author, and rating are required." });
    }

    // Check if the restaurant exists
    const existingRestaurant = await Restaurant.findById(restaurant);
    if (!existingRestaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Create the review
    const newReview = await Review.create({
      restaurant,
      author,
      rating,
      review,
      comment,
    });

    // Update the restaurant with the new review
    existingRestaurant.reviews.push(newReview._id);
    await existingRestaurant.save();

    // Update statistics
    let stats = await Statistics.findOne({
      restaurant: existingRestaurant._id,
    });

    if (stats) {
      stats.reviews.push(newReview._id);

      // Recalculate average rating
      const totalRatings = await Review.countDocuments({
        restaurant: existingRestaurant._id,
      });
      const sumRatings =
        (
          await Review.aggregate([
            { $match: { restaurant: existingRestaurant._id } },
            { $group: { _id: null, total: { $sum: "$rating" } } },
          ])
        )[0]?.total || 0;

      stats.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
      await stats.save();
    } else {
      await Statistics.create({
        restaurant: existingRestaurant._id,
        reviews: [newReview._id],
        averageRating: rating,
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// Get all reviews for a specific restaurant or menu item
exports.getReviewsForRestaurant = asyncHandler(async (req, res) => {
  const { reviewTarget } = req.params;

  if (!reviewTarget) {
    return res.status(400).json({ message: "Review target is required" });
  }

  try {
    // Find the restaurant by reviewTarget
    const restaurant = await Restaurant.findById(reviewTarget).populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "name",
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        reviews: restaurant.reviews, // Return the reviews from the restaurant
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// Create Review for MenuItem
exports.createReviewForMenuItem = asyncHandler(async (req, res) => {
  const { menuItem, author, rating, review, comment } = req.body;

  try {
    // Validate required fields
    if (!menuItem || !author || !rating) {
      return res
        .status(400)
        .json({ message: "Menu item, author, and rating are required." });
    }

    // Check if the menu item exists
    const existingMenuItem = await MenuItem.findById(menuItem);
    if (!existingMenuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    // Create the review
    const newReview = await Review.create({
      menuItem,
      author,
      rating,
      review,
      comment,
    });

    // Update the menu item with the new review
    existingMenuItem.reviews.push(newReview._id);
    await existingMenuItem.save();

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// Get all reviews for a specific menu item
exports.getReviewsForMenuItem = asyncHandler(async (req, res) => {
  const { reviewTarget } = req.params;

  if (!reviewTarget) {
    return res.status(400).json({ message: "Review target is required" });
  }

  try {
    // Find the menu item by reviewTarget
    const menuItem = await MenuItem.findById(reviewTarget).populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "name",
      },
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        reviews: menuItem.reviews, // Return the reviews from the menu item
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get all reviews for a specific menu item
exports.getTopThreeByRestaurantId = asyncHandler(async (req, res) => {
  const { reviewTarget } = req.params; //reviewTarget is restaurant id

  if (!reviewTarget) {
    return res.status(400).json({ message: "Review target is required" });
  }

  try {
    //פונקציה שמקבלת מערך של מספרים ומחזירה את הממוצע של המספרים
    const average = (arr) => {
      if (arr?.length === 0) return 0; // התמודדות עם מערך ריק
      const sum = arr?.reduce((acc, num) => acc + num, 0);
      return sum / arr?.length;
    };

    const restaurant = await Restaurant.findById(reviewTarget);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    const menu = await Menu.findById(restaurant.menu);

    const items = menu.items;

    const averageRatingArr = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findById(item._id);

        if (!menuItem || !menuItem.reviews)
          return { averageRating: 0, item: null }; // טיפול במקרה שאין מנה או חוות דעת

        const reviewsArr = menuItem.reviews;

        const ratingArrOfMenuItem = await Promise.all(
          reviewsArr.map(async (reviewId) => {
            const review = await Review.findById(reviewId);
            return review ? review.rating : 0; // טיפול במקרה שאין חוות דעת
          })
        );

        let averageRating = average(
          ratingArrOfMenuItem.filter((rating) => rating > 0)
        ); // התעלמות מדירוגים ריקים

        return { averageRating, item: menuItem }; // החזרת המידע על המנה
      })
    );
    console.log(averageRatingArr);

    const getTopThreeNumbers = (arr = []) => {
      return arr
        .filter((item) => item.item !== null) // סינון מנות שלא קיימות
        .sort((a, b) => b.averageRating - a.averageRating) // מיון בסדר יורד
        .slice(0, 3); // חיתוך לשלוש המנות הטובות ביותר
    };

    const topThree = getTopThreeNumbers(averageRatingArr);

    res.status(200).json({
      status: "success",
      data: {
        topThree, // Return the reviews from the menu item
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
