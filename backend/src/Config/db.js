import mongoose from "mongoose";
import "dotenv/config";

const DB_URL = process.env.MONGO_URL;

const ConnectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed" + err);
  }
};

export default ConnectDB;
