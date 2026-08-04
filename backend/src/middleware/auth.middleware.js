const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { User } = require('../models');

// checks for a bearer token, verifies it, and attaches the user to req.user
// so downstream controllers know who's making the request
async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to continue.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('The user this token belongs to no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    // covers expired tokens, malformed tokens, wrong signature, etc
    next(new AppError('Invalid or expired token, please log in again.', 401));
  }
}

module.exports = protect;
