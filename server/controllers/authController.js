const crypto = require("crypto");
const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const asyncHandler = require("express-async-handler");
const sendSMS = require("../utils/smsConfig");
const geocoder = require("../utils/geocoder");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { email, name, password, confirmPassword, phoneNumber, address } = req.body;

  // Check if required fields are provided
  if (!email || !password || !confirmPassword || !name || !address) {
    return res.status(400).json({ msg: "Missing details" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    // Geocode the address using Google Maps API
    const geoData = await geocoder.geocode(address);

    if (!geoData.length) {
      return res.status(400).json({ msg: "Unable to geocode address" });
    }

    const { latitude, longitude } = geoData[0];

    // Create the new user with geocoded location
    const newUser = await User.create({
      email,
      name,
      password,
      confirmPassword, // Note: `confirmPassword` is used for validation only
      address,
      phoneNumber,
      location: { type: "Point", coordinates: [longitude, latitude] },
    });

    res.status(201).json({ status: "success", newUser });
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error: error.message });
  }
});


exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(403, "Missing login details"));

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return next(new AppError(404, "The user does not exist"));

  if (!(await user.checkPassword(password, user.password)))
    return next(new AppError(403, "Incorrect email or password"));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  console.log("Token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};
exports.restrictByPremium = (req, res, next) => {
  if (req.user.role != "premium")
    return next(new AppError(403, "This rescource is not alowed"));
  next();
};
exports.restrictByRole = (...alowedRoles) => {
  return (req, res, next) => {
    if (!alowedRoles.includes(req.user.role))
      return next(new AppError(403, "The resoure is not alowed for this role"));
    next();
  };
};

///1 forgot password :
//נבדוק את המייל  ונשלח אליו קישור לשינוי סיסמה  הקישור יהיה תקף כ 5 דק
//sending emails
//change password

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  if (!email || !phoneNumber)
    return next(new AppError(400, "Missing email or phone number"));

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
    console.error("SMS send error:", err); // Log the actual error for debugging
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(500, `There was an error sending the SMS: ${err.message}`)
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { plainResetToken } = req.params;

  if (!password || !confirmPassword || !plainResetToken)
    return next(new AppError(401, "Missing details"));

  const hashedToken = crypto
    .createHash("sha256")
    .update(plainResetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  }).select("+password");

  if (!user) return next(new AppError(400, "Token is invalid or has expired"));

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been changed",
  });
});

exports.logoutUser = asyncHandler((req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-site cookies if production
    expires: new Date(0), // Expire the cookie
  });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});
