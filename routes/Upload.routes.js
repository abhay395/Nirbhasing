// routes/upload.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig");

const router = express.Router();

// Multer setup to temporarily store files in "uploads/" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
// Upload route to handle PDF uploads
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // Set to "raw" for PDFs
    });
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
exports.router = router;
