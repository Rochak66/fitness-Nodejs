const toolModel = require("../models/toolsModel");
const {
  validationMessages,
  errorResponseMessages,
  successResponseMessages,
} = require("../helper/message");
const RESPONSE = require("../helper/response");
const { body, validationResult } = require("express-validator");
const { upload } = require("../middleware/multerMiddleware.js");

exports.createToolsCategory = [
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
      // let image;
      // for (image of logo) {
      //   console.log("loop", image.path);
      // }
      const { name } = req.body;
      const existingCategory = await toolModel.findOne({name});
      console.log("hesdf",existingCategory)
      if (existingCategory) {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.CATEGORY_EXISTS
        );
      }

      const obj = {
        name,
        logo: imagePath,
      };

      const createToolsCategory = await toolModel.create(obj);
      if (createToolsCategory) {
        return RESPONSE.successResponseWithData(
          res,
          createToolsCategory,
          successResponseMessages.CATEGORY_CREATED
        );
      } else {
        return RESPONSE.errorResponse(
          res,
          errorResponseMessages.SOMETHING_WENT_WRONG
        );
      }
    } catch (error) {
      console.error("Error in category creation:", error);
      return RESPONSE.errorResponse(res, errorResponseMessages.SERVER_ERROR);
    }
  },
];
