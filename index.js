const express = require("express");
require("dotenv").config();
const app = express();
const crypto = require("crypto");
const MongoStore = require('connect-mongo');

//All Routers
const {
  departmentHeadRouter,
  authRouter,
  userRouter,
  sliderRouter,
  studentRouter,
  teacherRouter,
  timeTableRouter,
  uploadRouter,checkRouter
  ,headlineRouter
  ,researchRouter
  ,certificationRouter
} = require("./service/AllRoutes");
const path = require("path");
const {connectDb} = require("./db/connectdb");

//passport js
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;

//cors for set cors origen
const cors = require("cors");

// CookieExtractor For Extracte cookies from request
const { cookieExtractor, isAuth } = require("./service/com");
const cookieParser = require("cookie-parser");
const User = require("./models/User.model");

// TODO: cors setup
app.use(express.static("build"));
app.use(cors());

// TODO: body parser
app.use(express.json());
app.use(cookieParser());

// TODO: session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret', // Use a secure secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL, // MongoDB connection string
      ttl: 14 * 24 * 60 * 60, // Sessions expire after 14 days
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie expiration time
      secure: process.env.NODE_ENV === 'production', // Set this to true if using HTTPS
      httpOnly: true,
    },
  })
);

// TODO: session passport initalize
app.use(passport.session());
app.use(passport.initialize());

// TODO: JWT opts Objecte set
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// ?? Strategies

//  ** Local strategies
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "Incorrect password." });
            }
            const token = jwt.sign(
              { name: user.name, _id: user.email },                  
              process.env.JWT_SECRET_KEY
            );
            // // console.log(token);
            return done(null, token);
          }
        );
      } catch (error) {
        // // console.log(error);
        return done(null, { message: "unautherized" });
      }
    }
  )
);

//  ** jwt strategies

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const { _id } = jwt_payload;
      console.log(jwt_payload);
      // // console.log("jwt payload",jwt_payload)
      // // console.log("user",data)
      if (_id) {
        return done(null, _id);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done({ message: "unauth" }, false);
    }
  })
);

//  ** passport Serializer and deserializer
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("*", (req, res) => res.sendFile(path.resolve("build")));
app.use("/auth", authRouter.router);
app.use("/user", isAuth(), userRouter.router);
app.use("/department-head", departmentHeadRouter.router);
app.use("/slider", sliderRouter.router);
app.use("/student", studentRouter.router);
app.use("/teacher", teacherRouter.router);
app.use("/timeTable", timeTableRouter.router);
app.use("/headline", headlineRouter.router);
app.use("/upload", uploadRouter.router);
app.use("/research", researchRouter.router);
app.use("/certification", certificationRouter.router);
app.use("/check", isAuth(), checkRouter.router);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
connectDb();
