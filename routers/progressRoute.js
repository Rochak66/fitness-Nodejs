const express = require('express');
const router = express.Router();

const progressStatus = require("../controllers/progressController.js")

router.put("/updateProgressStatus",progressStatus.updateProgressStatus);

module.exports = router;