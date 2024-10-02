const express = require("express");
const router = express.Router();
const {upload} = require('../middlewares/multer.middlewares')
const teacherController = require("../controller/Teacher.controller");
const { fileSizeError } = require("../middlewares/fileSizeError");


// GET: Fetch all teachers
router.get("/", teacherController.getTeachers);

// POST: Add new teacher
router.post("/", upload.single("image"), fileSizeError,teacherController.addTeacher);

// PUT: Update teacher details
router.put("/:id",upload.single("image"),teacherController.updateTeacher);

// DELETE: Remove teacher
router.delete("/:id", teacherController.removeTeacher);

exports.router = router;
