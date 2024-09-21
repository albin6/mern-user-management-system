import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("database connected successfully");
  } catch (error) {
    console.error(error);
  }
}

export default connectDB;
