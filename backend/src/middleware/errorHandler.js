const logger=require("../config/logger");

// global error handler
function errorHandler(err, req, res, next) {

  const statusCode=err.statusCode || 500;
  const isOperational=err.isOperational || false;

  if (isOperational) {

    logger.warn(
      {
        err,
        path: route,
      },
      err.message
    );

  } else {

    logger.error(
      {
        err,
        path: route,
      },
      "Unexpected error"
    );

  }
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(statusCode).json({
    success: false,
    message: isOperational
      ? err.message
      : "Something went wrong, please try again later",
  });

}

// wrapper for async functions
function catchAsync(fn) {

  return (req, res, next)=>{

    fn(req, res, next).catch(next);

  };

}

module.exports={
  errorHandler,
  catchAsync,
};