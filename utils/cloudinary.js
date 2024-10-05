const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

const uploadOncloudinary = async (req,type) => {
  // if (!localFilePath) {
  //   return null;
  // }
  try {
    const result = await new Promise((resolve, reject) => {
      // Check if the file is an image
      const mimeType = req.file.mimetype;
      if (!mimeType.startsWith(type)) {
         reject({error:`Only ${type} uploads are allowed.`});
      }
    
      cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          reject({error:"Cloudinary upload failed"});
        } else {
          // console.log(result.secure_url);
          resolve(result);
        }
      }).end(req.file.buffer);
    });
    // console.log(result);
    return result;
  } catch (error) {
    return error
   
    // res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.uploadOncloudinary = uploadOncloudinary;
