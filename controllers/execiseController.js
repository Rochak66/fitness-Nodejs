const {
  validationMessages,
  errorResponseMessages,
  successResponseMessages,
} = require("../helper/message");
const{uploadMedia} = require("./userControllers.js")
const { excercise } = require("../models/excercise.js");
const { excerciseCategory } = require("../models/excerciseCatagory");
const RESPONSE = require("../helper/response");
const { query, body, validationResult } = require("express-validator");
const { upload } = require("../middleware/multerMiddleware.js");
const mongoose = require("mongoose");
const path = require("path");


//create excercise category
exports.createExerciseCategory = [
  body("name")
    .notEmpty()
    .trim()
    .isString()
    .withMessage(validationMessages.REQUIRED_FIELD),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // const logo = req.files;
      // console.log("imagel", logo);
      // let image;
      // for (image of logo) {
      //   console.log("loop", image.path);
        // logoPaths.push(image.path);
      //}
      // console.log("hdsfhsuhbsu",logo.path);
      const { name } = req.body;
      const existingCategory = await excerciseCategory.findOne({ name });
      console.log(existingCategory);
      if (existingCategory) {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CATEGORY_EXISTS
        );
      }
      const newCategory = {
        name,
        logo: imagePath,
      };

      const createdCategory = await excerciseCategory.create(newCategory);
      if (createdCategory) {
        return RESPONSE.successResponseWithData(
          res,
          successResponseMessages.CATEGORY_CREATED,
          createdCategory
        );
      } else {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CREATION_ERROR
        );
      }
    } catch (err) {
      console.error("Error in category creation:", err);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

//get excercise category
exports.getExcerciseCategory = [
  async (req, res) => {
    try {
      const findExercise = await excerciseCategory.find();
      if (findExercise) {
        return RESPONSE.successResponseWithData(
          res,
          findExercise,
          successResponseMessages.GETTING_EXCERCISE
        );
      } else {
        return RESPONSE.serverError(
          res,
          errorResponseMessages.SOMETHING_WENT_WRONG
        );
      }
    } catch (err) {
      console.log(err, "error in getting");
      return RESPONSE.errorResponse(
        res,
        "An error occurred while fetching exercise category data"
      );
    }
  },
];

//create excercise 
exports.createExcercise = [
  body("name").notEmpty().isString().trim().withMessage("Name is required"),
  body("exerciseCatagoryId").notEmpty().withMessage("Category ID is required"),

  async (req, res) => {
    console.log("req.files", req.files);
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return RESPONSE.errorResponse(res, errors.array());
    }

    try {
      const { exerciseCatagoryId, name, description, tips } = req.body;
      // let { image, video_url } = req.files;
      let image, video_url;
      console.log("hello", req.files);
      const findExerciseCatagory = await excerciseCategory.findOne({
        _id: exerciseCatagoryId,
      });
      if (req.files) {
        req.files.forEach((media) => {
          if (media.path) {
            if (media.fieldname === "image") {
              image = media.path;
              console.log("image", image);
            } else if (media.fieldname === "video_url") {
              video_url = media.path;
              console.log("video", video_url);
            }
          }
        });
      }

      if (!findExerciseCatagory) {
        return RESPONSE.errorResponse(res, "Category is not present");
      }

      const findExercise = await excercise.findOne({ name });
      if (findExercise) {
        return RESPONSE.errorResponse(res, "Exercise Already Exists");
      }

      const obj = {
        exerciseCatagoryId,
        name,
        image,
        video_url,
        description,
        tips,
      };
      console.log("hello", image);

      const createExercise = await excercise.create(obj);
      if (createExercise) {
        return RESPONSE.successResponseWithData(
          res,
          "Exercise is created",
          createExercise
        );
      } else {
        return RESPONSE.errorResponse(res, "Something went wrong");
      }
    } catch (err) {
      console.log(err, "error in Exercise creation");
      return RESPONSE.errorResponse(res, "Server error");
    }
  },
];

//get excercise details
exports.excerciseDetails = [
  async (req, res) => {
    try {
      const { excercise_id } = req.query;
      if (!excercise_id) {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.EXCERCISE_ID_IS_REQUIRED
        );
      }

      const excerciseDetail = excercise.findOne({ _id: excercise_id });
      if (excerciseDetail) {
        return RESPONSE.successResponseWithData(
          res,
          excerciseDetail,
          "find Details"
        );
      } else {
        return RESPONSE.errorResponseWithData(res, "details are not find");
      }
    } catch (err) {
      console.log(err, "server error");
    }
  },
];

//Get excercise
exports.getExcercise = [
  query("name").trim().notEmpty().withMessage("Exercise name is required"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0].msg,
          errors.array()
        );
      }

      const categoryName = req.query.name;
      let findCategoryName;

      if (categoryName) {
        findCategoryName = await excerciseCategory.findOne({
          name: categoryName,
        });
        if (!findCategoryName) {
          return RESPONSE.errorResponse(res, "Exercise category is not found");
        }
      }

      const matchCondition = categoryName
        ? { category_id: new mongoose.Types.ObjectId(findCategoryName._id) }
        : {};

      if (findCategoryName && findCategoryName.name === categoryName) {
        const findExercise = await excercise.aggregate([
          { $match: matchCondition },
          {
            $lookup: {
              from: "excercise",
              localField: "_id",
              foreignField: "category_id",
              as: "exerciseCategory",
              // pipeline: [
              //   { $match: { userId: new mongoose.Types.ObjectId(req.current_user._id) } }
              // ]
            },
          },
          {
            $project: {
              name: 1,
              image: 1,
              video_url: 1,
              description: 1,
              tips: 1,
            },
          },
        ]);
        return res.json({ data: findExercise });
      } else {
        const exercises = await excercise.find(matchCondition);
        return res.json({ data: exercises });
      }
    } catch (error) {
      console.log(error, "error in get exercise");
      return RESPONSE.errorResponse(
        res,
        "An error occurred while fetching exercise data"
      );
    }
  },
];

//paticular excerices
exports.excerciseList = [
  async(req,res)=>{
    try{
      const {excerciseCategory_id} = req.query;
      if(!excerciseCategory_id){
        return RESPONSE.errorResponse(err,'category_id is not found')
      }
      const excerciseDetails = await excercise.findOne({excerciseCategory_id:excerciseCategory_id});
      if(excerciseDetails){
        return RESPONSE.successResponseWithData(res,excerciseDetails,"excerciseDetails find");
      } else{
        return RESPONSE.errorResponse(res,'details not find')
      }
    } catch(err){
      console.log(err);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  }
]
