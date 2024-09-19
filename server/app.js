const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const usersRouter = require('./routes/user.Routes')
const restaurantRouter = require("./routes/restaurants.Routes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./utils/errorHandler");
const userRoutes = require("./routes/user.Routes");
const OrdersRoutes = require("./routes/order.Routes");
const menuRoutes = require("./routes/menu.Routes");
const path = require("path"); // Add this line
const app = express();
const menuItemRoutes = require("./routes/menuItem.Routes");
const reviewRoutes = require("./routes/review.Routes");
const statisticsRoutes = require("./routes/statistics.Routes");
const authController = require("./controllers/authController");
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:5173"],
  })
);
app.use(cookieParser());

app.use("/api/restaurants", restaurantRouter);
app.use("/api/users", userRoutes);

app.use("/api/menu", menuRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use(express.static("uploads")); // Serve static files from the uploads folder
app.use("/api/orders", authController.protect, OrdersRoutes);
app.use("/api/menuitems", menuItemRoutes); // Use the menu item routes

app.use("/api/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(404, "The requested route is not exist"));
});

app.use(globalErrorHandler);
module.exports = app;
