const mongoose = require("mongoose");
async function connectDb() {
    try {
   await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
}

exports.connectDb = connectDb