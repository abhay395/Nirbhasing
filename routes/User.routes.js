const express = require("express");
const { featchUser } = require("../controller/User.controoler");


const router = express.Router()

router
.get('/own',featchUser)

exports.router = router;