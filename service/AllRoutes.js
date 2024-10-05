const authRouter = require("../routes/Auth.routes");
const userRouter = require("../routes/User.routes");
const studentRouter = require("../routes/Student.routes");
const teacherRouter = require("../routes/Teacher.routes");
const timeTableRouter = require("../routes/TimeTable.routes");
const uploadRouter = require("../routes/Upload.routes");
const checkRouter = require("../routes/Check.routes");
const headlineRouter = require("../routes/Headline.routes");
const researchRouter = require("../routes/Reserach.routes");
const certificationRouter = require("../routes/Certification.routes");
const placementStudentRouter = require("../routes/PlacementStudent.routes");

module.exports = {
  authRouter,
  userRouter,
  studentRouter,
  teacherRouter,
  timeTableRouter,
  uploadRouter,
  checkRouter,
  headlineRouter,
  researchRouter,
  certificationRouter,
  placementStudentRouter,
};
