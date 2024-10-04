const express = require('express');
const {
  getAllTimeTables,
  getTimeTableById,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
} = require('../controller/TimeTable.controller.js'); // Import controller functions
const {upload} = require('../middlewares/multer.middlewaresforPdf.js');

const router = express.Router();

// Route to get all timetable entries
router.get('/', getAllTimeTables);

// Route to get a specific timetable by ID
router.get('/:id', getTimeTableById);

// Route to create a new timetable entry
router.post('/',upload.single("pdf"),createTimeTable);

// Route to update a timetable by ID
router.put('/:id',upload.single("pdf"),updateTimeTable);

// Route to delete a timetable by ID
router.delete('/:id', deleteTimeTable);

exports.router = router;
