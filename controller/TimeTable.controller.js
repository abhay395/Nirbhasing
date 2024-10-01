const TimeTable = require("../models/TimeTable.js"); // Assuming the schema is in models folder
const { uploadOncloudinary } = require("../utils/cloudinary");
// Get all timetable entries
const getAllTimeTables = async (req, res) => {
  try {
    const queryObject = {}

    // const { session } = req.query.session;
    if (req.query.session) {
      queryObject.courseSession = req.query.session
    }
    const timeTables = await TimeTable.find(queryObject);
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

// Update a timetable entry
const updateTimeTable = async (req, res) => {
  try {
    const { courseName, courseSession, type } = req.body;
    let timeTable = await TimeTable.findOne({ courseName, courseSession });
    if (timeTable && timeTable[type] === "Comming Soon") {
      const result = await uploadOncloudinary(req.file.path, "raw");
      if (!result || !result.secure_url) {
        return res.status(500).json({ error: "Error uploading pdf" });
      }
      const id = timeTable._id._id;
      console.log(id);
      const updatedTimeTable = await TimeTable.findByIdAndUpdate(
        id,
        { $set: { [type]: result.secure_url } },
        { new: true }
      );
      // // console.log(tl);
      return updatedTimeTable;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Create a new timetable
const createTimeTable = async (req, res) => {
  const { courseName, courseSession, type } = req.body;

  try {
    const updatedTimeTable = await updateTimeTable(req, res);
    if (updatedTimeTable) {
      res.status(200).json(updatedTimeTable);
    } else {
      console.log(req.file.path);
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
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating timetable", error });
  }
};

// Delete a timetable entry
const deleteTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findByIdAndDelete(req.params.id);

    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }

    res.status(200).json({ message: "Time table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting timetable", error });
  }
};

module.exports = {
  getAllTimeTables,
  getTimeTableById,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
};
