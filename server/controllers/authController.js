const crypto = require("crypto")
const User = require('./../models/usersModel')
const AppError = require('./../utils/AppError')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const asyncHandler = require('express-async-handler')
const sendEmail = require("./../utils/email");

exports.registerUser = asyncHandler(async(req, res ,next)=>{
    const {email, name, password, confirmPassword} = req.body;
    if (!email ||!password||!confirmPassword || !name) return next(new AppError(403, 'Missing details'))
        const newUser = await User.create({email, name, password, confirmPassword})
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
    const { email } = req.body;
    if (!email) return next(new AppError(401, "Bad request email is missing"));
    const user = await User.findOne({ email });
    if (!user)
      return next(
        new AppError(404, "No account associated with the given email")
      );
    //change password token
    const resetToken = user.createPasswordResetToken();
  
    // user.passwordResetToken = hashedPasswordResetToken;
    
    await user.save({
      validateBeforeSave: false,
    });
    // const resetUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/users/resetPassword/${resetToken}`;
    // console.log(resetUrl);
    const resetUrl = `${req.get(
      "origin"
    )}/resetPassword.html?resetToken=${resetToken}`;
    console.log(resetUrl);
    ///send this reset url to the users email
    const mailOptions = {
      from: "Shoppi <donotreplay@shoppi.com>",
      to: user.email,
      subject: "Password reset",
      text: `<h3>Please follow this link to reset your password </h3> <a href="${resetUrl}">Click here to reset your password</a> `,
    };
    try {
      await sendEmail(mailOptions);
      res.status(200).json({
        status: "success",
        message: "The password reset link has been sent to your email",
        resetToken,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError(500, "There was a problem sending email"));
    }
  });

  exports.resetPassword = asyncHandler(async (req, res, next)=> {
    const {password, confirmPassword } = req.body;
    const {plainResetToken } = req.params;
    if (!password || !confirmPassword || !plainResetToken)
        return next(new AppError(401,"Misssing Detailes"));
    //encryps plain token to match the reset token in db
    const hashedToken = crypto.createHash('sha256')
    .update(plainResetToken)
    .digest("hex")
    //find user based on the reset token
    const user = await User.findOne({passwordResetToken: hashedToken,
     passwordResetExpires:{ $gte: Date.now()},}).select('+password');
    //  if (user.checkPassword(password, user.password))
    //     return next(new AppError(401, "You can`t use the same password twice"))
    if (!user ) return next(new AppError(400, "Do forgot password again"))
    //change password
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    //save user
    await user.save()
    res.status(200).json({
        status: 'success',
        message: 'The password has been change'
    })
  })

  exports.logout = (req, res)=>{
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0)
  })
  res.status(200).json({
    status: 'success',
    message: 'Logout success'
})
  }