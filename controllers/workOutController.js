const {
  validationMessages,
  errorResponseMessages,
  successResponseMessages,
} = require("../helper/message");
const RESPONSE = require("../helper/response");
const workOutPlanModel = require("../models/workoutPlan.js");
const userWorkOutPlanModel = require("../models/userWorkoutPlan.js");
const workOutCategoryModel = require("../models/workOutCatagory.js");
const { query, body, validationResult } = require("express-validator");
const { upload } = require("../middleware/multerMiddleware.js");

//create workout category
exports.createWorkOutCatagory = [
  body("name")
    .notEmpty()
    .isString()
    .trim()
    .withMessage("workoutCatagory name is required"),
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

      const { name } = req.body;
      const existingCatagory = await workOutCatagoryModel.findOne({ name });
      if (existingCatagory) {
        return RESPONSE.errorResponse(res, errorResponseMessages.PLAN_EXISTS);
      }
      const catagory = {
        name: name,
      };
      const createWorkOutPlanCatagory = workOutPlanModel.create(catagory);
      if (createWorkOutPlanCatagory) {
        return RESPONSE.successResponseWithData(
          res,
          successResponseMessages.PLAN_CREATED,
          createWorkOutPlanCatagory
        );
      } else {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CREATION_ERROR
        );
      }
    } catch (error) {
      console.log(error);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];
//create workoutPlan
exports.createWorkOutPlans = [
  body("name")
    .notEmpty()
    .isString()
    .trim()
    .withMessage("workout name is required"),
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
      console.log("here2");
      const { name, description, totalweeks, minDays, imageUrl, documents } =
        req.body;
      const existingName = await workOutPlanModel.findOne({ name });
      console.log(existingName);
      if (existingName) {
        return RESPONSE.errorResponse(res, errorResponseMessages.PLAN_EXISTS);
      }
      const newWorkoutPlan = {
        name,
        imageUrl: `https://192.168.1.29:8080/${req.files[0].filename}`,
        description,
        totalweeks,
        minDays,
        // documents:`https://192.168.1.29:8080/${req.files[0].filename}`,
      };
      const createWorkOutPlan = workOutPlanModel.create(newWorkoutPlan);
      if (createWorkOutPlan) {
        return RESPONSE.successResponseWithData(
          res,
          successResponseMessages.PLAN_CREATED,
          createWorkOutPlan
        );
      } else {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CREATION_ERROR
        );
      }
    } catch (error) {
      console.log(error, "error in workout plan controller");
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

// exports.getWorkOutPlans = [
//   body("workOutPlanId")
//     .notEmpty()
//     .isString()
//     .trim()
//     .withMessage("workOutPlanId is required"),
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return RESPONSE.errorResponseWithData(
//           res,
//           errors.array()[0].msg,
//           errors.array()
//         );
//       }

//       const { workOutPlanId } = req.body;
//       console.log(req.body);
//       const workOutPlan = await workOutPlanModel.findOne({
//         _id: workOutPlanId,
//       });

//       if (workOutPlan) {
//         return RESPONSE.successResponseWithData(
//           res,
//           successResponseMessages.PLAN_GET,
//           workOutPlan
//         );
//       } else {
//         return RESPONSE.errorResponse(res, errorResponseMessages.NOT_FOUND);
//       }
//     } catch (error) {
//       console.error("Error in workout plan controller:", error);
//       return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
//     }
//   },
// ];

//get WorkOutPlan
exports.getWorkOutPlans = [
  query("name").trim().notEmpty().withMessage("category name is required"),
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
      let findCategory;
      if (categoryName) {
        findCategory = await workOutCategoryModel.findOne({
          name: categoryName,
        });
        if (!findCategory) {
          return RESPONSE.errorResponse(res, "Category not found");
        }
      }

      const matchCondition = categoryName
        ? { category_id: new mongoose.Types.ObjectId(findCategory._id) }
        : {};

      if (findCategory && findCategory.name === "AllWorkouts") {
        const findAllWorkOuts = await workOutPlanModel.aggregate([
          { $match: matchCondition },
          {
            $lookup: {
              from: "userWorkOutPlan",
              localField: "_id",
              foreignField: "workOutPlan_id",
              as: "allUserWorkOutPlan",
              pipeline: [
                {
                  $match: {
                    userId: new mongoose.Types.ObjectId(req.current_user._id),
                  },
                },
              ],
            },
          },
          {
            $project: {
              name: 1,
              imageUrl: 1,
              description: 1,
              totalweeks: 1,
              minDays: 1,
              documents: 1,
              status: 1,
            },
          },
        ]);
        return res.json({ data: findAllWorkOuts });
      } else if (categoryName === "HomeGym" || categoryName === "FatLoss") {
        const workOutPlans = await workOutPlanModel.aggregate(pipeline);
        return res.json({ data: workOutPlans });
      } else {
        const workOutPlans = await workOutPlanModel.find(matchCondition);
        return res.json({ data: workOutPlans });
      }
    } catch (error) {
      console.log(error, "error in getWorkOutPlans");
      return RESPONSE.errorResponse(
        res,
        "An error occurred while retrieving workout plans"
      );
    }
  },
];

//Create userworkoutplan
exports.createUserWorkOutPlans = [
  body("userId").notEmpty().withMessage("userId is required"),
  body("workOutPlanId").notEmpty().withMessage("workOutPlanId is required"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        userId,
        workoutPlanId,
        startDate,
        startTime,
        completionTime,
        selectDay,
        weeklyWeight,
        status,
      } = req.body;
      const existingUserWorkOutPlan = await userWorkOutPlanModel.find({
        userId,
        workoutPlanId,
      });
      if (existingUserWorkOutPlan) {
        return RESPONSE.errorResponse(res, errorResponseMessages.PLAN_EXISTS);
      }
      const userWorkOutPlan = {
        userId,
        workoutPlanId,
        startDate,
        startTime,
        completionTime,
        selectDay,
        weeklyWeight,
        status,
      };
      const createUserWorkOutPlan = await userWorkOutPlanModel.create(
        userWorkOutPlan
      );
      if (createUserWorkOutPlan) {
        return RESPONSE.successResponseWithData(
          res,
          successResponseMessages.PLAN_CREATED,
          createUserWorkOutPlan
        );
      } else {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CREATION_ERROR
        );
      }
    } catch (error) {
      console.log(error, "error in userWorkout controller");
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

// exports.userWorkOutStatus = [
//   body("userWorkOutPlanId").notEmpty().isString().trim().withMessage("userWorkOutPlanId is required"),
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return RESPONSE.errorResponseWithData(
//           res,
//           errors.array()[0].msg,
//           errors.array()
//         );
//       }

//       const { userWorkOutPlanId } = req.body;
//       const workOutPlan = await workOutPlanModel.findOne({
//         _id: userWorkOutPlanId,
//       });

//       if (!workOutPlan) {
//         return RESPONSE.errorResponse(res, "Workout plan not found");
//       }

//       const { startDate, startTime, completionTime, selectDay, weight } = workOutPlan;
//       let status;
//       if (startDate && startTime && completionTime && selectDay && weight) {
//         status = 'completed';
//       } else {
//         status = 'notCompleted';
//       }

//       return RESPONSE.successResponseWithData(res, "Workout status", { status });
//     } catch (error) {
//       console.error(error);
//       return RESPONSE.errorResponse(res, "Internal Server Error");
//     }
//   }
// ];

//getUserWorkOutPlan
exports.getUserWorkOutPlans = [
  body("userWorkOutPlanId")
    .notEmpty()
    .isString()
    .trim()
    .withMessage("userWorkOutPlanId is required"),
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
      const { userWorkOutPlanId } = req.body;
      console.log("hiii", req.body);
      const userWorkOutPlan = await userWorkOutPlanModel.findOne({
        _id: userWorkOutPlanId,
      });
      console.log(userWorkOutPlan);
      if (userWorkOutPlan) {
        return RESPONSE.successResponseWithData(
          res,
          successResponseMessages.PLAN_GET,
          userWorkOutPlan
        );
      } else {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CREATION_ERROR
        );
      }
    } catch (error) {
      console.log(error, "error in workout plan controller");
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];

//userWeekly Weight
exports.userWeeklyWeight = [
  body("userId").notEmpty().isString().trim().withMessage("userId is required"),
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
      const { userId, weight } = req.body;

      const weeklyWeight = {
        userId,
        weight,
      };

      const createWeeklyWeight = await userWorkOutPlan.create(weeklyWeight);

      if (createWeeklyWeight) {
        return RESPONSE.successResponseWithData(
          res,
          'msg saved',
          createWeeklyWeight
        );
      }
    } catch (error) {
      console.log(error, "error in  weekly weight creation");
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];


exports.createScheduleWorkOut = [
  body('userId').notEmpty().exists().trim().withMessage('userId is required'),
  async(req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0].msg,
          errors.array()
        );
      }

      const {startDate,startTime,selectDay,status} = req.body();
      const {userId} = req.body();

      const obj={
        userId:userId,
        startDate:startDate,
        startTime:startTime,
        selectDay:selectDay,
        status:status
      }

      const createScheduleWorkOut = await userWorkOutPlanModel.create(obj)
      if(createScheduleWorkOut){
        return RESPONSE.successResponseWithData(res,createScheduleWorkOut,'createdSuccessfully!!')
      }
      else{
        return RESPONSE.errorResponse(res,errorResponseMessages.SOMETHING_WENT_WRONG)
      }
    } catch(error){
      console.log(error, "error in  schedule workout");
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  }
]