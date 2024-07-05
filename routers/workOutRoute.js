const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multerMiddleware.js");
const workout = require("../controllers/workOutController.js");

//workOutPlan Category router
router.post('/createWorkOutPlanCatagory',workout.createWorkOutCatagory)
// router.post('/createWorkOutPlan',upload.any("imageUrl"),workout.createWorkOutPlans);

//get workoutplans router
router.get('/getWorkOutPlan',workout.getWorkOutPlans);

//create  userworkoutplans router
router.post('/createuserWorkOutPlan',workout.createUserWorkOutPlans);

//get userworkOutPlan router
router.get('/getUserWorkOutPlan',workout.getUserWorkOutPlans);

//workout Scheduled
router.post('/createScheduleWorkOut',workout.createScheduleWorkOut)

module.exports = router;

