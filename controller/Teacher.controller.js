const Teacher = require("../models/Teacher"); // Mongoose model
const { uploadOncloudinary } = require("../utils/cloudinary");
const fs = require("fs");
// GET: Fetch all teachers
exports.getTeachers = async (req, res) => {
  try {
    const queryObject = {};
    if(req.query.post){
      queryObject.post = req.query.post;
    }
    let teachers = Teacher.find(queryObject);
    if(req.query.limit){
      teachers.limit(req.query.limit).sort({timestamp: -1});
    }
    const result =  await teachers;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers" });
  }
};

// const cloudinary = require("../config/cloudinaryConfig");
// POST: Add new teacher
exports.addTeacher = async (req, res) => {
  try {
    const { name, qualification, email, post, description, phone } = req.body;
    console.log(req.body);

    if (!name || !qualification || !email || !post|| !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.file?.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadOncloudinary(req.file.path, "image");

    if (!result?.secure_url) {
      return res.status(500).json({ error: "Error uploading image" });
    }

    const teacherData = {
      name,
      qualification,
      email,
      image: result.secure_url,
      post,
      description
    };

    if (phone) {
      teacherData.phone = phone;
    }

    const teacher = new Teacher(teacherData);

    await teacher.save();
    res.status(201).json({ message: "Teacher added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT: Update teacher details
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, qualification, image, email, subject } = req.body;

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { name, qualification, image, email, subject },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Teacher updated successfully", updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher" });
  }
};

// DELETE: Remove teacher
exports.removeTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing teacher" });
  }
};
