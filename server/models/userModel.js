const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match!',
    },
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password !== this.confirmPassword) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // Remove confirmPassword after hashing
  next();
});

// Method to check password
userSchema.methods.checkPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
