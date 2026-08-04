const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/appError');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function signup({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // 10 salt rounds is a reasonable middle ground - enough to be slow for
  // brute forcing but not so slow it noticeably delays signup
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });
  const token = signToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });

  // deliberately vague message here - we don't want to reveal whether
  // it was the email or the password that was wrong
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Incorrect email or password.', 401);
  }

  const token = signToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
}

module.exports = { signup, login };
