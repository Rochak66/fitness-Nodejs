const JWT = require("jsonwebtoken");
const USER = require("../models/userModel.js");
const message = require("../helper/message.js");
const response = require("../helper/response.js");
require("dotenv").config();

const userAuthMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return response.notFound(res, message.validationMessages.TOKEN_MESSAGE);
  }
 
  const token = authorization.split(" ")[1];
  if (!token) {
    return response.notFound(res, message.validationMessages.TOKEN_MESSAGE);
  }
  
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const checkUser = await USER.findOne({ _id: userId });

    if (!checkUser) {
      return response.errorResponse(res, message.validationMessages.USER_NOT_EXIST);
    }

    req.createUser = checkUser; // Pass the actual user document
    next();
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) {
      return response.unauthorized(res, message.validationMessages.TOKEN_EXPIRED);
    }
    if (error instanceof JWT.JsonWebTokenError) {
      return response.unauthorized(res, message.validationMessages.INVALID_USER);
    }
    return response.errorResponse(res, message.validationMessages.INVALID_USER);
  }
};

module.exports = { userAuthMiddleware };


