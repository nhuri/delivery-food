const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const usersRouter = require('./routes/user.Routes')
const restaurantRouter = require('./routes/restaurants.Routes')
const AppError = require('./utils/AppError')
const globalErrorHandler = require('./utils/errorHandler')
const userRoutes = require('./routes/user.Routes');
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))
app.use(cors(
    {
        credentials: true,
        origin: ["http://127.0.0.1:5500"]
    }
))
app.use(cookieParser())


app.use('/api/restaurants', restaurantRouter);
app.use('/api/users', userRoutes);



app.all('*', (req, res, next) =>{
    next(new AppError(404,'The requested route is not exist'))
})

app.use(globalErrorHandler)
module.exports = app