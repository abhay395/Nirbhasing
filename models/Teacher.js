const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: { type: String ,required: true },
  image: { type: String },
  email: { type: String,required: true },
  post: { type: String ,required: true ,enum: ["Faculty", "HOD", "Principal","Staff"] },
  description: { type: String },
  phone: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Teacher', TeacherSchema);


const a={name: "Abhay",
qualification: "MCA ,BCA",
image: "https://res.cloudinary.com/dhcszkydc/image/upload/v1726813715/id4kju5v3ggg2s7tpvyx.png",
email: "Abhay@gmail.com"
}