const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerMiddleware.js");
const uploadMultiple = require("../utils/cloudinary.js")
const {
  signupController,
  loginController,
  helpController,
  signupwithSocialMediaController,
  resetPassword,
  verifyOtp,
  verifyEmail,
  updateUserInformation,
  deleteAccount,
  updateProfileImage,
  uploadMedia,
  createUserProfile,
  createChallenge,
  getChalllenge
} = require("../controllers/userControllers.js");
const { forgotPasswordWithOtp } = require("../controllers/userControllers.js");
const { userAuthMiddleware } = require("../middleware/userMiddleware");
const { checkUserStatus } = require("../middleware/userStatusMiddleware.js");

//user signup router
router.post("/signup",signupController);

//user socialmedia signup
router.post("/socialMediaSignup", signupwithSocialMediaController);

//login router
router.post("/login", checkUserStatus, loginController);

//resetPassword router
router.put("/resetPassword",resetPassword);

//forgotPassword with otp
router.put("/forgotPassword",userAuthMiddleware, forgotPasswordWithOtp);

//verify otp
router.post("/verifyOtp", verifyOtp);

//email verification
router.post("/verifyEmail",verifyEmail);

//create user profile
router.post("/createUserProfile",createUserProfile);

//update user  information
router.put("/userInfo",updateUserInformation);

//delete  account
router.delete("/deleteAccount",deleteAccount);

//heplCenter router
router.post("/help", helpController);

//uploadProfileImage
router.post("/uploadProfileImage",upload.array("images"),uploadMultiple,uploadMedia)


//updateProfileImage
router.post("/profileImg",updateProfileImage)

//create challenge
router.post("/createChallenge",createChallenge);

//get challenge
router.get("/getChalllenge",getChalllenge)

module.exports = router;
