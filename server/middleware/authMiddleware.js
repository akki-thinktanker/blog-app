const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(401)
        .json({
          error: true,
          statusCode: 401,
          message: 'Unauthorized request',
        });
    }
    const decodedToken = jwt.verify(token, 'thisisaccesstokensecret');


    const user = await User.findById(decodedToken._id).select(
      '-password -refreshToken -__v'
    );

    if (!user) {
      return res
        .status(401)
        .json({
          error: true,
          statusCode: 401,
          message: 'Invalid access token',
        });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
  }
};
