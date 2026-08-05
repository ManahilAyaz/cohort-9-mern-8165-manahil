const logger = require('../config/logger');

// centralized error handler - every controller just does next(err) or throws
// inside an async wrapper and it ends up here.
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

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

// every controller wraps its handler in this instead of a try/catch block
function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

module.exports = { errorHandler, catchAsync };