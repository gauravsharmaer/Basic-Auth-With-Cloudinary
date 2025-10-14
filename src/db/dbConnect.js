const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Basic_MERN_with_upload",
    });
    console.log("database connected");
  } catch (error) {
    console.error("error connecting db", error);
    throw error;
  }
};

module.exports = connectDB;
