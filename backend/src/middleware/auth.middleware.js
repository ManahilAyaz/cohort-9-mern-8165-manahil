const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { User } = require('../models');

async function protect(req, res, next) {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to continue.', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired token, please log in again.', 401));
  }

  try {
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('The user this token belongs to no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = protect;