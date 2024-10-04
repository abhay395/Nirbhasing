const Teacher = require("../models/Teacher"); // Mongoose model
const { uploadOncloudinary } = require("../utils/cloudinary");
const fs = require("fs");
// GET: Fetch all teachers
exports.getTeachers = async (req, res) => {
  try {
    const queryObject = {};
    if (req.query.post) {
      queryObject.post = req.query.post;
    }
    let teachers = Teacher.find(queryObject);
    if (req.query.limit) {
      teachers.limit(req.query.limit).sort({ timestamp: -1 });
    }
    const result = await teachers;

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

    if (!name || !qualification || !email || !post || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // if (!req.file?.path) {
    //   return res.status(400).json({ error: "No file uploaded" });
    // }
    // console.log("Hello",req.file);
    const result = await uploadOncloudinary(req, res);

    if (!result?.secure_url) {
      return res.status(500).json({ error: "Error uploading image" });
    }

    const teacherData = {
      name,
      qualification,
      email,
      image: result.secure_url,
      post,
      description,
    };

    if (phone) {
      teacherData.phone = phone;
    }
    const teacher = new Teacher(teacherData);
    await teacher.save();
    res.status(201).json({ message: "Teacher added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server" });
  }
};

// PUT: Update teacher details
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  const updateObj = {};
  const { name, qualification, email, phone, post, description } = req.body;
  if (name) updateObj.name = name;
  if (qualification) updateObj.qualification = qualification;
  if (email) updateObj.email = email;
  if (phone) updateObj.phone = phone;
  if (post) updateObj.post = post;
  if (description) updateObj.description = description;

  try {
    if (req.file?.path) {
      const result = await uploadOncloudinary(req.file.path, "image");
      if (result.secure_url) {
        updateObj.image = result.secure_url;
      }
      if (!result?.secure_url) {
        return res.status(500).json({ error: "Error uploading image" });
      }
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateObj, {
      new: true,
    });
    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher" });
  }
};

// DELETE: Remove teacher
exports.removeTeacher = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const result = await Teacher.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing teacher" });
  }
};
