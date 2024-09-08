const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: {
    type: String,
    required: [true, "The user must have an email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: [true, "Please provide a password"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  role: {
    type: String,
    enum: ["user", "premium"],
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

// Password encryption middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// Password check method
userSchema.methods.checkPassword = async function (inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

// Create Password Reset Token
// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//   this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // Token valid for 5 minutes
//   return resetToken;
// };


userSchema.methods.createPasswordResetToken = function () {
  // Generate a 6-digit numeric token
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the token and set expiration
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  
  return resetToken;
};


const User = mongoose.model("User", userSchema);
module.exports = User;
