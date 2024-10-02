const Student = require("../models/Student");
const { uploadOncloudinary } = require("../utils/cloudinary");
const fs = require("fs");
// Create and save a new student
exports.create = async (req, res) => {
  try {
    const { name, cgpa, course, year, rank, examYear } = req.body;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const result = await uploadOncloudinary(req.file.path, "image");
    if (!result || !result.secure_url) {
      console.log(imagePath);
      return res.status(500).json({ error: "Error uploading image" });
    }
    const newStudent = new Student({
      name,
      cgpa,
      course,
      year,
      image: result.secure_url,
      rank,
      examYear,
    });
    await newStudent.save();
    res.status(201).json({ message: "Student created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating student", error });
  }
};

// Retrieve all students
exports.findAll = async (req, res) => {
  try {
    const examYear = parseInt(req.query.examYear); // Get examYear from query string
    const course = req.query.course; // Get course from query string

    const filter = {
      ...(examYear && { examYear: examYear }), // Filter by examYear if provided
      ...(course && { course: course }), // Filter by course if provided
    };

    const studentsByYear = await Student.aggregate(
      [
        {
          $match: filter, // Filter data by examYear and course
        },
        {
          $group: {
            _id: { examYear: "$examYear", course: "$course" },
            "1stYearStudents": {
              $push: {
                $cond: [
                  { $eq: ["$year", 1] },
                  {
                    _id: "$_id",
                    name: "$name",
                    image: "$image",
                    cgpa: "$cgpa",
                    rank: "$rank",
                  },
                  null,
                ],
              },
            },
            "2ndYearStudents": {
              $push: {
                $cond: [
                  { $eq: ["$year", 2] },
                  {
                    _id: "$_id",
                    name: "$name",
                    image: "$image",
                    cgpa: "$cgpa",
                    rank: "$rank",
                  },
                  null,
                ],
              },
            },
            "3rdYearStudents": {
              $push: {
                $cond: [
                  { $eq: ["$year", 3] },
                  {
                    _id: "$_id",
                    name: "$name",
                    image: "$image",
                    cgpa: "$cgpa",
                    rank: "$rank",
                  },
                  null,
                ],
              },
            },
          },
        },
        {
          $project: {
            examYear: "$_id.examYear",
            course: "$_id.course",
            "1stYearStudents": {
              $filter: {
                input: {
                  $sortArray: { input: "$1stYearStudents", sortBy: { cgpa: -1 } },
                },
                as: "student",
                cond: { $ne: ["$$student", null] },
              },
            },
            "2ndYearStudents": {
              $filter: {
                input: {
                  $sortArray: { input: "$2ndYearStudents", sortBy: { cgpa: -1 } },
                },
                as: "student",
                cond: { $ne: ["$$student", null] },
              },
            },
            "3rdYearStudents": {
              $filter: {
                input: {
                  $sortArray: { input: "$3rdYearStudents", sortBy: { cgpa: -1 } },
                },
                as: "student",
                cond: { $ne: ["$$student", null] },
              },
            },
          },
        },
        { $sort: { examYear: -1 } },
      ])
    res.json(studentsByYear);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Retrieve a single student by ID
exports.findOne = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
};

// Update student details by ID
exports.update = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  const updateObject = {};

  if (req.body.name) updateObject.name = req.body.name;
  if (req.body.cgpa) updateObject.cgpa = req.body.cgpa;
  if (req.body.course) updateObject.course = req.body.course;
  if (req.body.year) updateObject.year = req.body.year;
  if (req.body.rank) updateObject.rank = req.body.rank;
  if (req.body.examYear) updateObject.examYear = req.body.examYear;

  try {
    const student = await Student.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating student", error });
  }
};

// Delete a student by ID
exports.delete = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};
