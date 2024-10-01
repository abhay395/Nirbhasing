const cloudinary= require('../config/cloudinaryConfig')
const fs = require('fs')

const uploadOncloudinary=async(localFilePath,fileType)=>{
    if(!localFilePath){
        return null;
    }
  try {
      const result = await cloudinary.uploader.upload(localFilePath, {
          resource_type: fileType,
        });
        fs.unlinkSync(localFilePath)
        return result;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}
exports.uploadOncloudinary=uploadOncloudinary;