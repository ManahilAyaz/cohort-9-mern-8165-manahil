const authService=require("../services/auth.service");
const { catchAsync }=require("../middleware/errorHandler");
const logger=require("../config/logger");
const AppError=require("../utils/appError");

// signup
const signup=catchAsync(async (req, res, next)=>{

  const name=req.body.name;
  const email=req.body.email;
  const password=req.body.password;

  if (!name || !email || !password) {
    return next(
      new AppError("Name, email and password are all required.", 400)
    );
  }

  if (password.length<6) {
    return next(
      new AppError("Password must be at least 6 characters long.", 400)
    );
  }

  const result=await authService.signup({
    name: name,
    email: email,
    password: password,
  });

  logger.info(
    { userId: result.user.id },
    "New user signed up"
  );

  res.status(201).json({
    success: true,
    data: result,
  });

});

// login
const login=catchAsync(async (req, res, next)=>{

  const email=req.body.email;
  const password=req.body.password;

  if (!email || !password) {
    return next(
      new AppError("Email and password are required.", 400)
    );
  }

  const result=await authService.login({
    email: email,
    password: password,
  });

  logger.info(
    { userId: result.user.id },
    "User logged in"
  );

  res.status(200).json({
    success: true,
    data: result,
  });

});

// logout
const logout=catchAsync(async (req, res)=>{

  logger.info(
    { userId: req.user?.id },
    "User logged out"
  );

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });

});

module.exports={
  signup,
  login,
  logout,
};