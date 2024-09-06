const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const usersRouter = require('./routes/user.Routes')
const restaurantRouter = require('./routes/restaurants.Routes')
const AppError = require('./utils/AppError')
const globalErrorHandler = require('./utils/errorHandler')
const userRoutes = require('./routes/user.Routes');
const OrdersRoutes = require('./routes/order.Routes');
const path = require('path');  // Add this line
const app = express()
const menuItemRoutes = require('./routes/menuItem.Routes');
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))
app.use(cors(
    {
        credentials: true,
        origin: ["http://127.0.0.1:5173"]
    }
))
app.use(cookieParser())


app.use('/api/restaurants', restaurantRouter);
app.use('/api/users', userRoutes);
app.use('/api/orders', OrdersRoutes);


app.use(express.static("uploads")); // Serve static files from the uploads folder

app.use('/api/menuitems', menuItemRoutes); // Use the menu item routes



app.all('*', (req, res, next) =>{
    next(new AppError(404,'The requested route is not exist'))
})

app.use(globalErrorHandler)
module.exports = app