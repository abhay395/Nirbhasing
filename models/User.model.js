const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId:{type:String,required:false},
  githubId:{type:String,required:false},
  name:{type:String,required:true},
  github:{type:String,required:false,unique:false,default:null},
  email:{type:String,required:false,default:null},
  image:{type:String,required:false,default:null},
  password:{type:Buffer,required:false},
  salt:{type:Buffer,required:false},
});

const User = mongoose.model('User', userSchema);

module.exports = User
