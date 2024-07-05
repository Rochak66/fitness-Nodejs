const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   return cb(null, path.join(__dirname, "../public/temp")); 
  },
  filename: function (req, file, cb) {
   return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
module.exports = {upload};