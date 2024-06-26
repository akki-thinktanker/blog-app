const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();


    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    // return res.status(500).json({
    //   message: 'Something went wrong while generating access and refresh token',
    // });
    console.log(err.message);
  }
};

exports.registerUser = catchAsync(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field.trim() === '')) {
    // throw new ApiError(400, 'All fields are required');
    return res.status(400).json({
      error: true,
      statusCode: 400,
      message: 'All fields are required',
    });
  }

  // check if user exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    // throw new ApiError(409, "User with email or username already exists")
    return res.status(409).json({
      error: true,
      statusCode: 409,
      message: 'User with email or username already exists',
    });
  }

  // Create user in DB

  const user = await User.create({
    email,
    username: username.toLowerCase(),
    password,
  });

  // remove password field from response

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    return res.status(500).json({
      error: true,
      statusCode: 500,
      message: 'Something went wrong while registering the user',
    });
  }

  // return res

  return res.status(201).json({
    error: false,
    statusCode: 201,
    message: 'User registration successful',
  });
});

exports.loginUser = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    return res.status(400).json({
      error: true,
      statusCode: 400,
      message: 'Username or email is required',
    });
  }

  const user = await User.findOne({ $or: [{ username }, { email }] }).select(
    '+password'
  );

  if (!user) {
    return res
      .status(404)
      .json({ error: true, statusCode: 404, message: "User doesn't exist" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      error: true,
      statusCode: 401,
      message: 'Invalid user credentials',
    });
  }

  // access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .status(200)
    .json({
      error: false,
      statusCode: 200,
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: 'User loggedin successfully',
    });
});
