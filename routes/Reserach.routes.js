const {
  addResearch,
  getResearch,
  deleteResearch,
  updateResearch,
} = require("../controller/Reserch.controller");

const express = require("express");
const { upload } = require("../middlewares/multer.middlewares");

const router = express.Router();

router.post("/",upload.single("image"),addResearch);
router.get("/", getResearch);
router.delete("/:id", deleteResearch);
router.put("/:id", upload.single("image"),updateResearch);

exports.router = router;