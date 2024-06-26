const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false //this was causing issue while logging in 
  },
  refreshToken: {
    type: String,
    select: false
  }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    'thisisaccesstokensecret',
    {
      expiresIn: '1d',
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, 'thisisrefreshtokensecret', {
    expiresIn: '10d',
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
