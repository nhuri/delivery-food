const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust the path as needed
const authController = require('../controllers/authController'); // Adjust the path as needed


// Define routes and attach controller functions
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:plainResetToken', authController.resetPassword);
router.get('/restaurants/nearby/:userID', userController.getNearbyRestaurants);


module.exports = router;