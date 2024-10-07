const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  cgpa: { type: Number ,required: true },
  course: { type: String ,enum: ["Bsc.cs", "Msc.cs", "BCA"],required: true }, 
  year: { type: Number ,required: true },
  rank: { type: Number },
  examYear: { type: Number ,required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Student', StudentSchema);
