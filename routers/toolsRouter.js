const express = require('express');
const router = express.Router();
const { upload } = require("../middleware/multerMiddleware.js");
const tool = require("../controllers/toolsController.js")

router.post("/createToolsCategory",tool.createToolsCategory)

module.exports = router;

