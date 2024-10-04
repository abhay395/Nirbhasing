// routes/upload.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig");
const router = express.Router();

// Multer setup to temporarily store files in "uploads/" folder
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
// Upload route to handle PDF uploads
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream((error, result) => {
      if (error) return res.status(500).send('Cloudinary upload failed');
      res.status(200).json({ url: result.secure_url ,message:"uploaded"});
    }).end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
exports.router = router;
