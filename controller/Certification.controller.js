const Certification = require("../models/Certification");

const addCertification = async (req, res) => {
  const { name, description, duration, mode, skillsGained } = req.body;
  console.log(req.body)
  if (!name || !description || !duration || !mode || !skillsGained) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newCertification = new Certification({
      name,
      description,
      duration,
      mode,
      skillsGained,
    });
    await newCertification.save();
    res.status(201).json({ message: "Certification added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding certification", error });
  }
};
const getCertifiations = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching certifications", error });
  }
};
const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    res.status(200).json({ message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting certification", error });
  }
};
const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    res.status(200).json({ message: "Certification updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating certification", error });
  }
}
module.exports = { addCertification, getCertifiations, deleteCertification,updateCertification };