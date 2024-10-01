const express = require("express");
const {
  createUser,
  LoginUser,
  googleCallbackFunction,
  logout,
  checkAuth,
} = require("../controller/Auth.controller");
const passport = require("passport");
const { isAuth } = require("../service/com");
const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), LoginUser)
  .get("/checkUser",isAuth(), checkAuth)
  .get("/logout", logout);

exports.router = router;
