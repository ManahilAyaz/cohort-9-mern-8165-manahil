const logger = require('../config/logger');

// centralized error handler - every controller just does next(err) or throws
// inside an async wrapper and it ends up here.
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // operational errors (bad request, not found, unauthorized) are expected
  // stuff so we log them as warnings. anything else is a real bug - log it
  // as an error with the full stack so we can actually debug it later.
  if (isOperational) {
    logger.warn({ err, path: req.originalUrl }, err.message);
  } else {
    logger.error({ err, path: req.originalUrl }, 'Unexpected error');
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Something went wrong, please try again later',
  });
}

// wraps async route handlers so we don't need try/catch everywhere
function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

module.exports = { errorHandler, catchAsync };
