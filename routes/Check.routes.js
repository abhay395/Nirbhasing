const express = require("express");
const { checkAuth } = require("../controller/Auth.controller");


const router = express.Router()

router
.get('/myUser',checkAuth)

exports.router = router;