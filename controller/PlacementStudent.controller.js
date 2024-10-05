const PlacementStudent = require("../models/PlacementStudent");
const { uploadOncloudinary } = require("../utils/cloudinary");
const getPlacementStudents = async (req, res) => {
  try {
    const placements = await PlacementStudent.find();
    res.status(200).json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlacementStudent = async (req, res) => {
  const { name, company, package, year } = req.body;
  if (!name || !company || !package || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!req?.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const result = await uploadOncloudinary(req, "image/");
    if (!result?.secure_url) {
      return res.status(500).json({ error: result.error });
    }
    const placement = new PlacementStudent({
      name,
      company,
      package,
      year,
      image: result.secure_url,
    });
    await placement.save();
    res.status(201).json(placement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePlacementStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const updateObj = {};
    const { name, company, package, year } = req.body;
    if (name) updateObj.name = name;
    if (company) updateObj.company = company;
    if (package) updateObj.package = package;
    if (year) updateObj.year = year;

    if (req?.file) {
      const result = await uploadOncloudinary(req, "image/");
      if (!result?.secure_url) {
        return res.status(500).json({ error: result.error });
      }
      updateObj.image = result.secure_url;
    }

    const placement = await PlacementStudent.findByIdAndUpdate(id, updateObj, {
      new: true,
    });
    res.status(200).json(placement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlacementStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const placement = await PlacementStudent.findByIdAndDelete(id);
    if (!placement) {
      return res.status(404).json({ message: "Placement not found" });
    }
    res.status(200).json(placement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlacementStudents,
  createPlacementStudent,
  updatePlacementStudent,
  deletePlacementStudent,
};
