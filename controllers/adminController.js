// const adminModel = require('../models/adminModel.js')
// const RESPONSE = require("../helper/response");
// // const nodemailer = require("nodemailer");
// const {userMiddleware} = require("../middleware/userMiddleware");
// const emailService = require("../config/emailService"); 
// const {
//   validationMessages,
//   errorResponseMessages,
//   successResponseMessages,
// } = require("../helper/message");
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");



// // Sign In Controller
// const adminSignupController = async (req, res, next) => {
//   [
//     body("fullname")
//       .notEmpty()
//       .trim()
//       .isString()
//       .withMessage(validationMessages.USERNAME_VALIDATION),
//     body("email")
//       .notEmpty()
//       .trim()
//       .isEmail()
//       .withMessage(validationMessages.EMAIL_VALIDATION),
//     body("password")
//       .notEmpty()
//       .trim()
//       .isLength({ min: 5 })
//       .withMessage(validationMessages.PASSWORD_VALIDATION),
//     body("phoneno")
//       .optional()
//       .trim()
//       .isString()
//       .withMessage(validationMessages.NUMBER_VALIDATION),
//   ];

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return RESPONSE.errorResponseWithData(
//       res,
//       errors.array()[0]["msg"],
//       errors.array()
//     );
//   }
  

//   const { fullname, email, phoneno, password } = req.body;

//   try {
//     const existingAdmin = await adminModel.findOne({
//       email: email,
//     });
//     if (existingAdmin) {
//       return RESPONSE.errorResponse(res, errorResponseMessages.ALREADY_EXIST);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = await adminModel.create({
//       fullname: fullname,
//       email: email,
//       phoneno: phoneno,
//       password: hashedPassword,
//     });

//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     return RESPONSE.successResponseWithDataAndToken(
//       res,
//       successResponseMessages.SIGNUP_SUCCESSFULL,
//       admin,
//       token
//     );
//   } catch (error) {
//     console.log(error);
//     return RESPONSE.errorResponse(res, error);
//   }
// };

// // Login Controller
// const adminLoginController = async (req, res) => {
//   [
//     body("email")
//       .trim()
//       .notEmpty()
//       .withMessage(validationMessages.LOGIN_TYPE_VALIDAION),
//     body("password")
//       .notEmpty()
//       .trim()
//       .isLength({ min: 5 })
//       .withMessage(validationMessages.PASSWORD_VALIDATION),
//   ];

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return RESPONSE.errorResponseWithData(
//       res,
//       errors.array()[0].msg,
//       errors.array()
//     );
//   }
//   const { email, password } = req.body;
//   console.log(req.body)
//   try {
//     const admin = await adminModel.findOne({ email }).select("+password");
//     console.log("admn",admin);
//     if (!admin) {
//       return RESPONSE.errorResponse(res, validationMessages.USER_NOT_EXIST);
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return RESPONSE.errorResponse(res, errorResponseMessages.USER_VALIDATION);
//     }
//     user.password = undefined;
//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: '1d',
//     });
//     return RESPONSE.successResponseWithDataAndToken(
//       res,
//       successResponseMessages.LOGIN_SUCCESSFULL,
//       admin,
//       token
//     );
//   } catch (error) {
//     console.error(error);
//     return RESPONSE.errorResponse(res, error.message);
//   }
// };


// // reset-password controller
// const adminforgotPasswordController = 
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return RESPONSE.badRequest(
//         res,
//         errors.array()[0].msg,
//         errors.array()
//       );
//     }
//     const adminId = req.adminId;
//       const { currentPassword, newPassword } = req.body;
//     try {
//       const admin = await adminModel.findById(adminId);
//       if (!admin || !(await admin.comparePassword(currentPassword))) {
//         return RESPONSE.unauthorized(res, "Invalid current password");
//       }
//       user.password = await user.hashPassword(newPassword);
//       await admin.save();
      
//       await sendEmail(
//         admin.email,
//         'Password Updated',
//         'Your password has been successfully updated.'
//       );
//       console.log("password updated");
//       RESPONSE.success(res, "Password updated");
//     } catch {
//       console.error('Forgot Password Error:', error);
//       return RESPONSE.serverError(res, 'Internal server error');
//     }
//   };
// module.exports = {
//     adminSignupController,
//     adminLoginController,
//   adminforgotPasswordController
// };


