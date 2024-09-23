const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email address."],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide your name."],
  },
  address: {
    type: String,
    required: [true, "Please provide your name."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: 8,
    select: false,
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin", "restaurant-owner"],
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
