// Import necessary modules
const express = require("express");
const router = express.Router();
const {
  getDeparmentHeadInfor,
  updateDeparmentHeadInfor,
} = require("../controller/DepartmentHead.controller");
// GET: Fetch Department Head details
router.get("/", getDeparmentHeadInfor);

// POST: Add or Update Department Head (admin)
router.post("/", updateDeparmentHeadInfor);

// Export the router
exports.router = router;
