const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerMiddleware.js");
const excercises= require("../controllers/execiseController.js");

//createExcerciseCategory router
router.post("/excerciseCategory", excercises.createExerciseCategory);

//get excerciseCategory router
router.get("/getExcerciseCategory", excercises.getExcerciseCategory);

//createExcercise router
router.post("/createExercise",excercises.createExcercise);

//getExcercise router
router.get("/getExcercise",excercises.getExcercise);

//get excercise details
router.get("/excerciseDetails", excercises.excerciseDetails);

//get excercise List
router.get("/excerciseList",excercises.excerciseList)


module.exports = router;
