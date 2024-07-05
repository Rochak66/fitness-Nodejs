const cloudinary = require("cloudinary").v2; // Ensure using cloudinary.v2
const fileSystem = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Upload an image
const uploadMultiple = async(req,res,next)=>{
  try{
    const images = req.files;
    const imageURLs = [];

    for(const image of images){
      const result = await cloudinary.uploader.upload(image.path,{
        resource_type:"auto"
      });

      imageURLs.push(result.secure_url);
    }
    req.images = imageURLs;

    next()
  } catch(error){
    fs.unlinkSync(localFilePath)
    console.log(error)
  }
}
module.exports = uploadMultiple;