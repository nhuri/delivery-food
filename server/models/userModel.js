const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({

    name: { type: String, required: true },

  email: {
    type: String,
    required: [true, "The user must have an email"],
    validate: {
      /*  validator: function(){
                return this.email.match('[a-zA-Z0-9.*%Â±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}')
             },
             */
      validator: function (el) {
        return validator.isEmail(el);
      },

      message: "The email is not valid",
    },
    unique: true,
  },
  password: {
    type: String,
    minLength: [8, "The password must be at least 8 characters or longer"],
    select: false,
    required: [true, "The password is required"],
  },
  confirmPassword: {
    type: String,
    minLength: [
      8,
      "The password confirmation must be at least 8 characters or longer",
    ],
    required: [true, "The retype the password"],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "The passwords not match",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user"],
      message: "The role can only user",
    },
    default: "user",
  },
   addresses: [{ type: String }],
   paymentMethods: [{ type: String }],
   favoriteRestaurants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    
  },
   orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  
   paymentMethods: [{ type: String }],

//    profileImage: { type: String },

  
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,

});





//Document miiddleware - THIS refers to a current document before the actual save into db
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
  }
  next();
});
userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});
userSchema.methods.checkPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;