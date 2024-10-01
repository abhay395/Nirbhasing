const express = require("express");
const router = express.Router();
const StudentController = require("../controller/Student.controller");
const { fileSizeError } = require("../middlewares/fileSizeError");
const {upload} = require('../middlewares/multer.middlewares')


router.post("/create",upload.single("image"), fileSizeError,StudentController.create);
router.get("/getAll", StudentController.findAll);
router.get("/getOne/:studentId", StudentController.findOne);
router.put("/update/:studentId", StudentController.update);
router.delete("/delete/:studentId", StudentController.delete);

exports.router = router;