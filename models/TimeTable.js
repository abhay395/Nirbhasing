const mongoose = require('mongoose');

// Time Table Schema
const timeTableSchema = new mongoose.Schema({
  courseSession: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  timeTable: {
    type: String,
    default:"Comming Soon",
  },
  cce:{
    type:String,
    default:"Comming Soon"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;
