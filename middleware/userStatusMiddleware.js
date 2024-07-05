const User = require('../models/userModel');
const { validationMessages, errorResponseMessages, successResponseMessages } = require("../helper/message");
const RESPONSE = require("../helper/response");

const checkUserStatus = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return RESPONSE.errorResponse(res, validationMessages.USER_NOT_EXIST);;
    }

    if (user.status === 'inactive') {
      return res.status(402).json({ message: 'User account is inactive' });
    }

    req.user = user; 
    next();
  } catch (error) {
    return RESPONSE.errorResponse(res, error.message);
  }
};

module.exports = {checkUserStatus};
