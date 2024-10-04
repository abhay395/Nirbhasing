const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

const uploadOncloudinary = async (req,res) => {
  // if (!localFilePath) {
  //   return null;
  // }
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          reject("Cloudinary upload failed");
        } else {
          console.log(result.secure_url);
          resolve(result);
        }
      }).end(req.file.buffer);
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
    // res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.uploadOncloudinary = uploadOncloudinary;
