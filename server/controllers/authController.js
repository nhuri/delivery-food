const crypto = require("crypto")
const User = require('./../models/userModel')
const AppError = require('./../utils/AppError')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const asyncHandler = require('express-async-handler')
const sendSMS = require('../utils/smsConfig')


exports.registerUser = asyncHandler(async(req, res ,next)=>{
    const {email, name, password, confirmPassword, phoneNumber} = req.body;
    if (!email ||!password||!confirmPassword || !name) return next(new AppError(403, 'Missing details'))
        const newUser = await User.create({email, name, password, confirmPassword, phoneNumber})
     res.status(201).json({
        status:'success', 
        newUser
     })
    
    
})
exports.loginUser = asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body
    if (!email || !password) return next(new AppError(403, 'Missing login details'))
    ///find user by its email
     const user = await User.findOne({email}).select('+password')
     if(!user) return next((new AppError(404, 'The user not exist please check your email or register')))
    ///check the password
     if (!await user.checkPassword(password, user.password)) 
    return next(new AppError(403, 'Email or password is incorrect'))
    /// generate token 
    const token =  jwt.sign({id: user._id}, process.env.JWT_SECRET,  { expiresIn: process.env.JWT_EXPIRES_IN } )
    
    res.cookie('jwt',token,{
        httpOnly:true,
        expires:  new Date(Date.now() + 14*24*60*60*1000),
        secure:true,
        sameSite:'none',
    }
    )
    ///send it to a client 
    res.status(200).json({
        status:'success',
        token
    })
    ///cookie or res.json()


})

exports.protect = asyncHandler(async (req, res, next)=>{
///1 extract token from : a req.headers or b from cookies
//a 
//console.log(req.cookies);
if (!req.cookies || !req.cookies.jwt) return next(new AppError(403, 'Please login!'))
 const token = req.cookies.jwt

//console.log(token);
///2 verify token and extract payload data id 
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
console.log(decoded.exp);
console.log(Date.now());

if (!decoded || !decoded.exp >= Date.now()/1000){
    return next (new AppError(403, 'Please login'))
}
///3 find user by id 
const user = await User.findById(decoded.id)
if (!user) return next (new AppError(403, 'Please login user'))
///4 upload user to req object
// if(user.passwordChangedAt > decoded.iat) 
// return next(new AppError(403, "please login user"));
req.user = user

/// go to the next function
next()


})

exports.restrictByPremium = (req, res, next)=> {
    if(req.user.role != "premium") 
        return next(new AppError(403,'This rescource is not alowed'))
    next();
};
exports.restrictByRole = (...alowedRoles) =>{
    return (req, res, next) => {
    if(!alowedRoles.includes(req.user.role))
        return next (new AppError(403, "The resoure is not alowed for this role"));
    next();
};
};

///1 forgot password :
//נבדוק את המייל  ונשלח אליו קישור לשינוי סיסמה  הקישור יהיה תקף כ 5 דק
//sending emails
//change password

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  if (!email || !phoneNumber) return next(new AppError(400, "Missing email or phone number"));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError(404, "No user found with this email"));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
console.log(resetToken);

  const message = `Your password reset code is: ${resetToken}. It is valid for 5 minutes.`;
  try {
    await sendSMS(phoneNumber, message); // Pass phoneNumber and message to sendSMS
    res.status(200).json({
      status: "success",
      message: "Password reset token sent to your phone.",
    });

  } catch (err) {
    console.error("SMS send error:", err);  // Log the actual error for debugging
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, `There was an error sending the SMS: ${err.message}`));
  }
});




exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { plainResetToken } = req.params;

  if (!password || !confirmPassword || !plainResetToken)
    return next(new AppError(401, "Missing details"));

  const hashedToken = crypto.createHash('sha256')
    .update(plainResetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  }).select('+password');

  if (!user) return next(new AppError(400, "Token is invalid or has expired"));

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password has been changed',
  });
});




  exports.logoutUser = asyncHandler((req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Cross-site cookies if production
        expires: new Date(0) // Expire the cookie
    });

    res.status(200).json({
        status: 'success',
        message: 'Logout successful'
    });
});