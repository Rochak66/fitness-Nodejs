const progressTrackingModel = require("../models/progressTracking.js");
const {
  validationMessages,
  errorResponseMessages,
  successResponseMessages,
} = require("../helper/message");
const RESPONSE = require("../helper/response");
const { body, validationResult } = require("express-validator");
const { upload } = require("../middleware/multerMiddleware.js");

exports.updateProgressStatus = [
    body("user_id").notEmpty().exists().withMessage('UserId is required'),
    async(req,res)=>{
        try{
            const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return RESPONSE.errorResponseWithData(
          res,
          errors.array()[0]["msg"],
          errors.array()
        )
      }

      const {date, height, heightUnit, weight,weightUnit} = req.body;
      const {user_id} = req.body;
      const obj={
        date:date,
        height:height,
        heightUnit:heightUnit,
        weight:weight,
        weightUnit:weightUnit
      }

      const updateprogressTracking = await progressTrackingModel.findByIdAndUpdate(user_id,obj,{new:true});
      if(updateprogressTracking){
        return RESPONSE.successResponseWithData(res,updateprogressTracking,'updated successfully!')
      }  else{
        return RESPONSE.errorResponse(res,errorResponseMessages.SOMETHING_WENT_WRONG)
      }
        } catch(error){
            console.log(error,'server error');
        return  RESPONSE.errorResponse(res, errorResponseMessages.INTERNAL_SERVER_ERROR);
        }}
]