const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const { User }=require("../models");
const AppError=require("../utils/appError");

// jwt token
function signToken(id) {
  const token=jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  return token;
}

// signup
async function signup(data) {
  const name=data.name;
  const email=data.email;
  const password=data.password;

  const userExists=await User.findOne({ email: email });

  if (userExists) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const hashedPassword=await bcrypt.hash(password, 10);

  const newUser=await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  const token=signToken(newUser._id);

  return {
    token: token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  };
}

// login
async function login(data) {
  const email=data.email;
  const password=data.password;

  const user=await User.findOne({ email: email });

  if (!user) {
    throw new AppError("Incorrect email or password.", 401);
  }

  const passwordMatched=await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw new AppError("Incorrect email or password.", 401);
  }

  const token=signToken(user._id);

  return {
    token: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}

module.exports={
  signup,
  login,
};