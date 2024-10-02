const {
  addResearch,
  getResearch,
  deleteResearch,
} = require("../controller/Reserch.controller");

const express = require("express");
const { upload } = require("../middlewares/multer.middlewares");

const router = express.Router();

router.post("/",upload.single("image"),addResearch);
router.get("/", getResearch);
router.delete("/:id", deleteResearch);

exports.router = router;