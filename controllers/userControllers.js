const userModel = require("../models/userModel");
const helpModel = require("../models/help.js");
const challengesModel = require("../models/challenges.js");
const RESPONSE = require("../helper/response");
const { userMiddleware } = require("../middleware/userMiddleware");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../config/emailService");
const {
  validationMessages,
  errorResponseMessages,
  successResponseMessages,
} = require("../helper/message");
const { body, validationResult } = require("express-validator");
const { upload } = require("../middleware/multerMiddleware.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign In Controller
const signupController = [
  body("fullname")
    .notEmpty()
    .trim()
    .isString()
    .withMessage(validationMessages.USERNAME_VALIDATION),
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage(validationMessages.EMAIL_VALIDATION),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 5 })
    .withMessage(validationMessages.PASSWORD_VALIDATION),
  body("phoneno")
    .optional()
    .trim()
    .isString()
    .withMessage(validationMessages.NUMBER_VALIDATION),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return RESPONSE.errorResponseWithData(
        res,
        errors.array()[0]["msg"],
        errors.array()
      );
    }

    const { fullname, email, phoneno, password } = req.body;

    try {
      const existingUser = await userModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingUser) {
        return RESPONSE.errorResponse(res, errorResponseMessages.ALREADY_EXIST);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.create({
        fullname: fullname.toLowerCase(),
        email: email.toLowerCase(),
        phoneno: phoneno,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const verificationLink = `https://localhost:8080/verify-email?token=${token}`;

      const receiver = {
        from: "randomMail@gmail.com",
        to: email,
        subject: "Verify Your Email",
        text: `verify your  email:${verificationLink}`,
      };

      console.log("receiver", receiver);
      await sendEmail(receiver);

      return RESPONSE.successResponseWithDataAndToken(
        res,
        successResponseMessages.SIGNUP_SUCCESSFULL,
        user,
        token
      );
    } catch (error) {
      console.log(error);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

//VERIFY OTP
const verifyOtp = [
  async (req, res) => {
    try {
      const { otp, email } = req.body;
      const user = await userModel.findOne({ email: email });
      if (!user)
        return RESPONSE.errorResponse(res, errorMessage.USER_NOT_EXIST);

      console.log("user otp", user.email_otp);

      if (otp !== user.email_otp) {
        return errorResponse(res, errorMessage.OTP_DO_NOT_MATCHED);
      } else {
        return RESPONSE.successResponse(res, successMessage.OTP_MATCHED);
      }
    } catch (error) {
      console.log(error.message);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

//Reset Password
const resetPassword = [
  body("newPassword")
    .trim()
    .notEmpty()
    .exists()
    .withMessage("NEW_PASSWORD_IS_REQUIRED"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .exists()
    .withMessage("CONFIRM_PASSWORD_IS_REQUIRED"),
  body("email").isEmail().trim().exists().withMessage("EMAIL REQUIRED"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0]["msg"],
          errors.array()
        );
      }
      //   const { token } = req.params;
      let { newPassword, confirmPassword, email } = req.body;
      const user = await userModel.findOne({ email: email.toLowerCase()});
      console.log("dfs",user)
      if (!user)
        return RESPONSE.errorResponse(res, errorMessage.USER_NOT_EXIST);

      if (newPassword !== confirmPassword)
        RESPONSE.errorResponse(res, errorResponseMessages.CONFPPASSWORD_NOT_MATCHED);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updated = await userModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      return RESPONSE.successResponseWithData(res,successResponseMessages.PASSWORD_CHANGED_SUCCESSFULLY);
    } catch (error) {
      console.log('------------',error)
      return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR); 
    }
  },
];

//Sign up with socialMedia
const signupwithSocialMediaController = [
  body("fullname")
    .notEmpty()
    .trim()
    .isString()
    .withMessage(validationMessages.USERNAME_VALIDATION),
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage(validationMessages.EMAIL_VALIDATION),
  body("phoneno")
    .optional()
    .trim()
    .isString()
    .withMessage(validationMessages.NUMBER_VALIDATION),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0]["msg"],
          errors.array()
        );
      }

      const { fullname, email, phoneno } = req.body;
      const checkAccount = await userModel.findOne({
        $or: [
          { fullname: fullname.toLowerCase() },
          { email: email ? email.toLowerCase() : {} },
        ],
        delete: false,
      });
      if (checkAccount) {
        return RESPONSE.errorResponseMessages.ALREADY_EXIST;
      }

      const newUser = await userModel.create({
        fullname: fullname.toLowerCase(),
        email: email.toLowerCase(),
        phoneno: phoneno,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return RESPONSE.successResponseWithDataAndToken(
        res,
        successResponseMessages.SIGNUP_SUCCESSFULL,
        newUser,
        token
      );
    } catch (error) {
      console.log(error);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

///verifyemail
const verifyEmail = [async (req, res) => {
  try {
    const token = req.query.token;
    console.log("dfdf", token);
    if (!token)
      return RESPONSE.errorResponse(res, errorResponseMessages.INVALID_TOKEN);
    console.log("her1");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log("jhk", userId);
    const user = await userModel.findById(userId);
    if (!user)
      return RESPONSE.errorResponse(res, errorResponseMessages.USER_NOT_FOUND);

    const refData = {
      email_verified: true,
    };
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: refData }
    );

    if (updatedUser) {
      console.log("Email Verified");
      RESPONSE.successResponse(
        res,
        successResponseMessages.YOUR_EMAIL_HAS_BEEN_VERIFIED
      );
    } else {
      console.log("Email not Verified");
      RESPONSE.errorResponse(
        res,
        errorResponseMessages.YOUR_EMAIL_IS_NOT_VERIFIED
      );
    }
  } catch (error) {
    console.log(error, "server error");
    return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
  }
}]

// Login Controller
const loginController = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(validationMessages.LOGIN_TYPE_VALIDAION),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 5 })
    .withMessage(validationMessages.PASSWORD_VALIDATION),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return RESPONSE.errorResponseWithData(
        res,
        errors.array()[0].msg,
        errors.array()
      );
    }
    const { email, password } = req.body;

    try {
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return RESPONSE.errorResponse(res, validationMessages.USER_NOT_EXIST);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.USER_VALIDATION
        );
      }
      user.password = undefined;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return RESPONSE.successResponseWithDataAndToken(
        res,
        successResponseMessages.LOGIN_SUCCESSFULL,
        user,
        token
      );
    } catch (error) {
      console.error(error);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

// reset-password controller
// const forgotpasswordController = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return RESPONSE.badRequest(res, errors.array()[0].msg, errors.array());
//   }
//   const userId = req.userId;
//   const { currentPassword, newPassword } = req.body;
//   try {
//     const user = await userModel.findById(userId);
//     if (!user || !(await user.comparePassword(currentPassword))) {
//       return RESPONSE.unauthorized(res, "Invalid current password");
//     }
//     user.password = await user.hashPassword(newPassword);
//     await user.save();

//     await sendEmail(
//       user.email,
//       "Password Updated",
//       "Your password has been successfully updated."
//     );
//     console.log("password updated");
//     RESPONSE.success(res, "Password updated");
//   } catch {
//     console.error("Forgot Password Error:", error);
//     return RESPONSE.serverError(res, "Internal server error");
//   }
// };

//forget password contoller
const forgotPasswordWithOtp = [
  body("email")
    .notEmpty()
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter valid email"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return RESPONSE.badRequest(res, errors.array()[0].msg, errors.array());
    }

    let testAccount = await nodemailer.createTestAccount();

    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email: email });
      if (!user)
        return RESPONSE.errorResponse(res, errorMessage.USER_NOT_EXIST);

      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MY_GMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });

      const getOTP = await generateRandomNumber();

      const receiver = {
        from: "randomMail@gmail.com",
        to: email,
        subject: "Password Reset Request",
        text: "Hello " + user.full_name + " OTP: " + getOTP + "",
        // text: "<p>Hello <b>" + user.full_name + "</b> OTP: <b>" + getOTP() + "</b></p>"
      };

      const refData = {
        email_otp: getOTP,
      };
      console.log("hhhhh", refData);

      const saveOtp = await userModel.findByIdAndUpdate(
        { _id: user._id },
        { $set: refData },
        { new: true }
      );

      console.log("resetLink := ", receiver);

      await transport.sendMail(receiver);

      return RESPONSE.successResponse(
        res,
        successMessage.OTP_SENDED_SUCCESSFULLY
      );
    } catch (error) {
      RESPONSE.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
    }
  },
];

//Delete  user Account
const deleteAccount = async (req, res) => {
  
  try {
    const { user_id } = req.body;
  console.log(req.body)
    const user = await userModel.findOneAndDelete(user_id);
    console.log("---",user)
    if (!user) {
      return RESPONSE.errorResponse(res, errorMessage.USER_NOT_EXIST);
    }
     return RESPONSE.successResponse(res,successResponseMessages.ACCOUNT_DELETED);
  } catch (error) {
    console.error('Error deleting user:', error);
    return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR, 500);
  }
};


//user help controller
const helpController = [
  body("text").notEmpty().trim().isString().withMessage("text is required"),
  body("file").notEmpty().trim().exists().withMessage("file is required"),
  async (req, res) => {
    try {
      const { topic, text, file } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0]["msg"],
          errors.array()
        );
      }

      const obj = {
        user_id: req.current_user._id,
        topic: topic,
        text: text,
        file: imagePath,
      };

      const help = await helpModel.create(obj);
      return RESPONSE.successResponseWithData(
        res,
        successResponseMessages.REQUEST_SEND,
        help
      );
    } catch (error) {
      console.log(error, "error in requestsend");
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

//upload user profile
const uploadMedia =[
  async (req, res) => {
    try {
      const imagePath = req.images;
      if(!imagePath || imagePath.length === 0){
        return RESPONSE.errorResponse(res, errorResponseMessages.NO_FILE_UPLOADED);
      }
      return RESPONSE.successResponseWithData(
        res,
        imagePath,
        successResponseMessages.PROFILE_UPDATED
      );
    } catch (error) {
      console.error("Server error:", error);
      return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
    }
  }
] 


//update user ProfileImage
const updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;
    const profileImg = req.images;
    console.log("jkhk",req.images)

    if (!profileImg) {
      return RESPONSE.errorResponse(res, errorResponseMessages.NO_FILE_UPLOADED);
    }

    
    const profile = await userModel.findOneAndUpdate(
      { _id: userId },
      { profileImage: imagePath },
      { new: true } 
    )
    console.log("ljhg",profile)

    if (profile) {
      return RESPONSE.successResponseWithData(
        res,
        profile,
        successResponseMessages.PROFILE_UPDATED
      );
    } else {
      return RESPONSE.errorResponse(
        res,
        errorResponseMessages.SOMETHING_WENT_WRONG
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
  }
};


//createuserProfile
const createUserProfile =[
  body("user_id").notEmpty().exists().withMessage('userId is required'),
  async(req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0]["msg"],
          errors.array()
        );
      }
      const {gender,dob,weight,weightUnit,height,heightUnit,goal} = req.body;
      const{user_id} = req.body;
      console.log("here1",req.body)
      const findUser = await userModel.findById(user_id);
      if(!findUser){
        return RESPONSE.errorResponse(res, validationMessages.USER_NOT_EXIST);
      }
      const obj={
        gender:gender,
        dob:dob,
        weight:weight,
        weightUnit:weightUnit,
        height:height,
        heightUnit:heightUnit,
        goal
      }
      console.log("dsd",req.images)
      const createProfile = await userModel.findByIdAndUpdate(user_id,obj,{new: true});
      console.log("createProfile",createProfile)
      if(createProfile){
        return RESPONSE.successResponseWithData(res,createProfile,'profile created')
      } else{
        return RESPONSE.errorResponse(res,errorResponseMessages.SOMETHING_WENT_WRONG)
      }
      console.log("-------")
    } catch(error){
      console.log(error,'server error');
      return  RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
    }
  }
]


//update userProfile information
const updateUserInformation = [
  // body("email").notEmpty().trim().isEmail().withMessage("Valid email is required"),
  async (req, res) => {
    try {
      const { fullname, email, phoneno, gender, dob, profileImg } = req.body;
      const {userId} = req.body;
      console.log(req.body)
      const obj = {
        fullname,
        phoneno,
        email,
        gender,
        dob,
        profileImg
      };

      const updateProfile = await userModel.findOneAndUpdate(userId);
      console.log(updateProfile)
        return RESPONSE.successResponseWithData(
          res,
          updateProfile,
          successResponseMessages.PROFILE_UPDATED
        );
    } catch (error) {
      console.error("server error", error);
      return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
    }
  },
];

//create challenges
const createChallenge = [
  async(req,res)=>{
    try{
      const{challengeType,challengeName,description} = req.body;
      const obj={
        challengeType,challengeName,description
      }

      const createChallenge = await challengesModel.create(obj);
      if(createChallenge){
        return RESPONSE.successResponseWithData(res,createChallenge,'challengeCreated')
      } else{
        return RESPONSE.errorResponse(errorResponseMessages.SOMETHING_WENT_WRONG)
      }
    } catch(error){
      console.log(error, "error in requestsend");
      return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
    }
  }
]

//get challenge
const getChalllenge=[
  async(req,res)=>{
    try{
      const {challenge_id} = req.body;

    const findChallenge = await  challengesModel.findById(challenge_id)
    if(findChallenge){
      return RESPONSE.successResponseWithData(res,findChallenge,'getting challenge')
    } else{
      RESPONSE.errorResponse(res,errorResponseMessages.CHALLENGE_NOT_FOUND)
    }
    } catch(error){
      console.log(error, "error in requestsend");
      return RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
    }
  }
]




module.exports = {
  signupController,
  loginController,
  forgotPasswordWithOtp,
  verifyOtp,
  helpController,
  resetPassword,
  signupwithSocialMediaController,
  verifyEmail,
  updateUserInformation,
  deleteAccount,
  updateProfileImage,
  uploadMedia,
  createUserProfile,
  createChallenge,
  getChalllenge
};
