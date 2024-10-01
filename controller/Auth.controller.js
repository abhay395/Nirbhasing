const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // // console.log(req.body)
    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email == "" ||
      password == ""
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        req.login(doc, (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              { name: user.name, _id: user._id },
              process.env.JWT_SECRET_KEY
            );
            // console.log("Jh")
            return res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ _id: user._id });
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.LoginUser = (req, res) => {
  const tokens= req.user
  console.log(tokens);
  return res
    .cookie("jwt", tokens, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .json({  token: tokens })
    .status(200)
};
exports.logout = (req, res) => {
  res
  .clearCookie("jwt")
  .status(200)
  .json({ message: "User succesfully logout" });
};

exports.checkAuth = async (req, res) => {
  if(req.user){
    console.log(req.user);
    res.json({message:"auth"}).status(200);
  }else{
    res.sendStatus(401).json({message:"unauth"})
  }
};
// exports.googleCallbackFunction = (req, res) => {
//   // *Successful authentication, set a cookie and redirect to the home page

//   res
//     .cookie("jwt", req.user, {
//       expires: new Date(Date.now() + 3600000),
//       httpOnly: true,
//     })
//     .status(201);
//   res.redirect("http://localhost:5173/");
// };
// // exports.githubCallbackFunction = (req, res) => {
// //   res
// //     .cookie("jwt", req.user, {
// //       expires: new Date(Date.now() + 3600000),
// //       httpOnly: true,
// //     })
// //     .status(201);
// //   // // console.log(req.user)

// //   // Successful authentication, redirect home.
// //   res.redirect("/");
// // };