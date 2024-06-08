const mongoose = require("mongoose");
const colors = require("colors");
// function mongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Database connected to ${mongoose.connection.host}`.bgCyan.white
    );
  } catch (error) {
    console.log("Error connecting in DB".bgRed.white, error);
  }
};
module.exports = connectDB;
