const express = require("express");
const router = express.Router();
const {
    getCertifiations,
    addCertification,
    deleteCertification,
    updateCertification
} = require("../controller/Certification.controller");

router.get("/", getCertifiations);
router.post("/", addCertification);
router.delete("/:id", deleteCertification);
router.put("/:id", updateCertification);

exports.router = router