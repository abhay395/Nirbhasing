const {
  addResearch,
  getResearch,
} = require("../controller/Reserch.controller");

const express = require("express");
const { upload } = require("../middlewares/multer.middlewares");

const router = express.Router();

router.post("/",upload.single("image"),addResearch);

router.get("/", getResearch);

exports.router = router;