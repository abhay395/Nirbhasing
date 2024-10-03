const { url } = require("../config/cloudinaryConfig.js");
const TimeTable = require("../models/TimeTable.js"); // Assuming the schema is in models folder
const { uploadOncloudinary } = require("../utils/cloudinary");
// Get all timetable entries
const getAllTimeTables = async (req, res) => {
  try {
    const queryObj = {};
    if (req.query.session) {
      queryObj.courseSession = req.query.session;
    }
    // if (!req.query.session) {
    // return res.status(400).json({ message: "Session is required" });
    // }
    const timeTables = await TimeTable.find(queryObj);
    // // console.log(timeTables);
    res.status(200).json(timeTables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timetables", error });
  }
};

// Get timetable by ID
const getTimeTableById = async (req, res) => {
  try {
    const timeTable = await TimeTable.findById(req.params.id);
    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }
    res.status(200).json(timeTable);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timetable", error });
  }
};



// Create a new timetable
const createTimeTable = async (req, res) => {
  const { courseName, courseSession, type } = req.body;

  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const result = await uploadOncloudinary(req.file.path, "raw");
    if (!result || !result.secure_url) {
      return res.status(500).json({ error: "Error uploading pdf" });
    }
    const newTimeTable = new TimeTable({
      courseName,
      courseSession,
      [type]: result.secure_url,
    });
    const savedTimeTable = await newTimeTable.save();
    res.status(200).json(savedTimeTable);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating timetable", error });
  }
};

// Delete a timetable entry
const deleteTimeTable = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const timeTable = await TimeTable.findByIdAndDelete(req.params.id);
    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }

    res.status(200).json({ message: "Time table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting timetable", error });
  }
};

const updateTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    // req.params
    console.log(req.params)
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const { type } = req.body;
    if (!req.file?.path) {
      return res.status(400).json({ message: "File is required" });
    }
    const result = await uploadOncloudinary(req.file.path, "raw");
    if (!result || !result.secure_url) {
      return res.status(500).json({ error: "Error uploading pdf" });
    }
    const updatedTimeTable = await TimeTable.findByIdAndUpdate(
      id,
      { $set: { [type]: result.secure_url } },
      { new: true }
    );

    if (!updatedTimeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }
   
      return res.status(200).json({ message: "Time table updated successfully" ,url:result.secure_url});
    // res.status(200).json(updatedTimeTable);
  } catch (error) {
    res.status(500).json({ message: "Error updating timetable", error });
    console.log(error);
  }
};
module.exports = {
  getAllTimeTables,
  getTimeTableById,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
};
